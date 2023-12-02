using System.Text.Json.Serialization;

namespace berserk_online_server.DTO.Cards
{
    public class CreatureCardInfo : FlyingCardInfo
    {
        [JsonPropertyName("moves")]
        public int Moves { get; set; }
    }
}
