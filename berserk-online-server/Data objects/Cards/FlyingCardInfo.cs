using System.Text.Json.Serialization;

namespace berserk_online_server.DTO.Cards
{
    public class FlyingCardInfo : CardInfo
    {
        [JsonPropertyName("health")]
        public int Health { get; set; }
        [JsonPropertyName("hit")]
#pragma warning disable CS8618 // Поле, не допускающее значения NULL, должно содержать значение, отличное от NULL, при выходе из конструктора. Возможно, стоит объявить поле как допускающее значения NULL.
        public HitInfo Hit { get; set; }
#pragma warning restore CS8618 // Поле, не допускающее значения NULL, должно содержать значение, отличное от NULL, при выходе из конструктора. Возможно, стоит объявить поле как допускающее значения NULL.
    }
}
