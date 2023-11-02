using System.Text.Json.Serialization;

namespace berserk_online_server.Models.Cards
{
    public class CardInfo
    {

        [JsonPropertyName("rarity")]
        public string Rarity { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("elite")]
        public bool Elite { get; set; }
        [JsonPropertyName("type")]
        public string Type { get; set; }
        [JsonPropertyName("image")]
        public string Image { get; set; }
        [JsonPropertyName("painter")]
        public string Painter { get; set; }
        [JsonPropertyName("elements")]
        public string[] Element { get; set; }
        [JsonPropertyName("price")]
        public int Price { get; set; }
        [JsonPropertyName("number")]
        public int Number { get; set; }
    }
}
