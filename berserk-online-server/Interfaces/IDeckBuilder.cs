using berserk_online_server.Models.Cards;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;

namespace berserk_online_server.Interfaces
{
    public interface IDeckBuilder
    {
        Deck BuildFromDb(DeckDb deckDb);
        DeckDb BuildToDb(Deck deckDb);
        Deck BuildFromRequest(DeckRequest request);
    }
}
