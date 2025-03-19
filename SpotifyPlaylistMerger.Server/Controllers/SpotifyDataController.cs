using Microsoft.AspNetCore.Mvc;
using SpotifyPlaylistMerger.Server.Model;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SpotifyPlaylistMerger.Server.Controllers
{
    [Route("api/SpotifyData")]
    [ApiController]
    public class SpotifyDataController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public SpotifyDataController()
        {
            _httpClient = new HttpClient();
        }
        private Playlist PlaylistHelper => new Playlist(_httpClient);


        [HttpGet("playlists")]
        public async Task<IActionResult> GetUserPlaylists([FromHeader] string Authorization)
        {
            if (string.IsNullOrEmpty(Authorization))
                return Unauthorized(new { error = "Token de autenticação ausente" });

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", Authorization.Replace("Bearer ", ""));

            var response = await _httpClient.GetAsync("https://api.spotify.com/v1/me/playlists");
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return BadRequest(new { error = "Erro ao obter playlists", details = responseBody });

            var playlists = JsonSerializer.Deserialize<Dictionary<string, object>>(responseBody);
            return Ok(playlists);
        }

        [HttpPost("merge")]
        public async Task<IActionResult> MergePlaylists([FromHeader] string Authorization, [FromBody] MergeRequest request)
        {
            if (string.IsNullOrEmpty(Authorization))
                return Unauthorized(new { error = "Token de autenticação ausente" });

            if (request.Playlists == null || request.Playlists.Count == 0)
                return BadRequest(new { error = "Nenhuma playlist selecionada" });

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", Authorization.Replace("Bearer ", ""));

            //Cria a nova playlist
            var playlistInfo = new PlaylistModel() { name = "Nova Playlist Mesclada", description = "Playlist gerada a partir do seu app!" };
            var newPlaylist = await PlaylistHelper.CreatePlaylist(playlistInfo);

            //Obtem e adiciona as novas músicas a playlist
            await PlaylistHelper.AddItemsFromPlaylists(newPlaylist, request.Playlists);

            return Ok(newPlaylist);
        }
    }

    public class MergeRequest
    {
        public List<string> Playlists { get; set; }
    }
}
