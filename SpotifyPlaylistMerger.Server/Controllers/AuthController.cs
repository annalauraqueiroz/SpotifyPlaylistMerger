using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using System.Web;

namespace SpotifyPlaylistMerger.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpotifyAuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public SpotifyAuthController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("login")]
        public IActionResult Login()
        {
            var clientId = _config["Spotify:ClientId"];
            var redirectUri = HttpUtility.UrlEncode(_config["Spotify:RedirectUri"]);
            var scope = "playlist-read-private playlist-modify-public playlist-modify-private";
            var url = $"https://accounts.spotify.com/authorize?client_id={clientId}&response_type=code&redirect_uri={redirectUri}&scope={scope}";
            return Redirect(url);
        }
        [HttpGet("callback")]
        public async Task<IActionResult> Callback(string code)
        {
            if (string.IsNullOrEmpty(code))
                return BadRequest("Código de autorização não encontrado.");

            try
            {

                var clientId = _config["Spotify:ClientId"];
                var clientSecret = _config["Spotify:ClientSecret"];
                var redirectUri = _config["Spotify:RedirectUri"];

                var tokenUrl = "https://accounts.spotify.com/api/token";

                var content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "grant_type", "authorization_code" },
                    { "code", code },
                    { "redirect_uri", redirectUri }
                });
                var byteArray = Encoding.ASCII.GetBytes($"{clientId}:{clientSecret}");
                var authHeader = Convert.ToBase64String(byteArray);

                var request = new HttpRequestMessage(HttpMethod.Post, tokenUrl)
                {
                    Content = content
                };

                request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

                using (var client = new HttpClient())
                {
                    var response = await client.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        var responseData = await response.Content.ReadAsStringAsync();

                        var jsonDocument = JsonDocument.Parse(responseData);
                        var tokenData = JsonSerializer.Deserialize<Dictionary<string, object>>(jsonDocument.RootElement.GetRawText());

                        var accessToken = tokenData["access_token"];
                        var refreshToken = tokenData.ContainsKey("refresh_token") ? tokenData["refresh_token"] : null;

                        return Ok(new { access_token = accessToken.ToString(), refresh_token = refreshToken.ToString() });
                    }
                    else
                    {
                        var errorResponse = await response.Content.ReadAsStringAsync();
                        return BadRequest($"Erro ao obter o token de acesso.{errorResponse}");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao processar a requisição: {ex.Message}");
            }
        }
    }
}
