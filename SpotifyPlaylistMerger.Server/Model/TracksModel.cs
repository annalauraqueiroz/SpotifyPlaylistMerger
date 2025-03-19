namespace SpotifyPlaylistMerger.Server.Model
{
    public class Track
    {
        public string id { get; set; }
    }
    public class PlaylistTrackObject
    {
        public int limit { get; set; }
        public string next { get; set; }
        public int offset { get; set; }
        public string previous { get; set; }
        public string href { get; set; }
        public int total { get; set; }
        public List<PlaylistItem> items { get; set; }
    }
    public class PlaylistItem
    {
        public Track track { get; set; }
    }
}
