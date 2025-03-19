using static System.Net.Mime.MediaTypeNames;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;

namespace SpotifyPlaylistMerger.Server.Model
{
    public class Playlist : PlaylistModel
    {
        private readonly HttpClient _httpClient;

        public Playlist(HttpClient client)
        {
            _httpClient = client;
        }
        public async Task<PlaylistModel> CreatePlaylist(PlaylistModel playlistInfo)
        {
            try
            {
                HttpContent content = JsonContent.Create(new { Name = playlistInfo.name ?? "Nova Playlist Mesclada", Description = playlistInfo.description });

                //Cria a playlist
                var response = await _httpClient.PostAsync("https://api.spotify.com/v1/me/playlists", content);
                var responseBody = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    return new PlaylistModel() { description = "Ocorreu um erro ao fazer sua requisição." };

                return JsonSerializer.Deserialize<PlaylistModel>(responseBody);

            }
            catch (Exception e)
            {
                return new PlaylistModel() { description = "Ocorreu um erro ao criar sua playlist." };
            }

        }
        public async Task AddItemsFromPlaylists(PlaylistModel target, List<string> playlistReferenceId)
        {
            try
            {
                var tracksResponse = new PlaylistTrackObject();
                //Obtém as músicas das playlists e insere na nova, em lotes de 50
                foreach (var playlistId in playlistReferenceId)
                {
                    do
                    {
                        //Obtem as músicas
                        var response = await _httpClient.GetAsync($"https://api.spotify.com/v1/playlists/{playlistId}/tracks?limit=50&offset=0");
                        var responseBodyPlaylist = await response.Content.ReadAsStringAsync();
                        tracksResponse = JsonSerializer.Deserialize<PlaylistTrackObject>(responseBodyPlaylist);

                        //Insere as músicas na nova playlist
                        var addItems = new 
                        {
                            playlist_id = target.id,
                            position = 0,
                            uris = tracksResponse.items.Select(t => $"spotify:track:{t.track.id}").ToArray()
                        };

                        HttpContent content = JsonContent.Create(addItems);

                        var responseAddItems = await _httpClient.PostAsync($"https://api.spotify.com/v1/playlists/{target.id}/tracks", content);

                        if (!responseAddItems.IsSuccessStatusCode)
                            break;


                        var responseBodyAddItems = await response.Content.ReadAsStringAsync();


                    } while (!string.IsNullOrEmpty(tracksResponse.next));


                }

            }

            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

        }
    }
    public class PlaylistModel
    {
        public bool collaborative { get; set; }
        public string description { get; set; }
        public FollowersModel followers { get; set; }
        public string href { get; set; }
        public string id { get; set; }
        public List<ImageModel> images { get; set; }
        public string primary_Color { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string uri { get; set; }
        public OwnerModel owner { get; set; }
        [JsonPropertyName("public")]
        public bool Public { get; set; }
        public string snapshot_Id { get; set; }
    }

    public class AddItemsToPlaylist
    {
        public string playlist_id { get; set; }
        public int position { get; set; }
        public string[] uris { get; set; }
    }

}
