using berserk_online_server.Models.Requests;

namespace berserk_online_server.Models.Cards
{
    public class Deck : DeckRequest
    {
        public new int Id { get; set; }
        public string[] Elements { get; set; }
    }
}
