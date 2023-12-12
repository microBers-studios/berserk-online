using berserk_online_server.Utils;

namespace berserk_online_server.Data_objects.Cards
{
    public class FilterParams
    {
        public string? Rarity { get; set; }
        public bool? Elite { get; set; }
        public string? Type { get; set; }
        public string[]? Element { get; set; }
        public NumbersRange? Price { get; set; }
        public NumbersRange? Health { get; set; }
        public NumbersRange? Moves { get; set; }

    }
}
