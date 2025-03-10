using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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

            // Simulação da fusão de playlists (para mesclar na real, seria necessário criar uma nova e copiar as músicas)
            var mergedPlaylist = new { message = "Playlists mescladas com sucesso!", playlists = request.Playlists };
            return Ok(mergedPlaylist);
        }
    }

    public class MergeRequest
    {
        public List<string> Playlists { get; set; }
    }
}
