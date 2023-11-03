using berserk_online_server.Models.Cards;

namespace berserk_online_server.Models.Requests
{
    public class DeckRequest
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public DeckCardInfo[] Main { get; set; }
        public DeckCardInfo[]? SideBoard { get; set; }
    }
}
