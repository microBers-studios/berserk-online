using System.Text.Json.Serialization;

namespace berserk_online_server.Models.Cards
{
    public class FlyingCardInfo : CardInfo
    {
        [JsonPropertyName("health")]
        public int Health { get; set; }
        [JsonPropertyName("hit")]
        public HitInfo Hit { get; set; }
    }
}
