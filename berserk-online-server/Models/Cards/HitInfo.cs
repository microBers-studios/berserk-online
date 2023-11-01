using System.Text.Json.Serialization;

namespace berserk_online_server.Models.Cards
{
    public class HitInfo
    {
        [JsonPropertyName("weak")]
        public int Weak { get; set; }
        [JsonPropertyName("normal")]
        public int Normal { get; set; }
        [JsonPropertyName("hard")]
        public int Hard { get; set; }
    }
}
