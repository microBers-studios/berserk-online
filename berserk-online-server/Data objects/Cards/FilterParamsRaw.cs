using berserk_online_server.Utils;

namespace berserk_online_server.Data_objects.Cards
{
    public class FilterParamsRaw
    {
        public string? Rarity { get; set; }
        public bool? Elite { get; set; }
        public string? Type { get; set; }
        public string? Element { get; set; }
        public string? Price { get; set; }
        public string? Health { get; set; }
        public string? Moves { get; set; }
    }
}
