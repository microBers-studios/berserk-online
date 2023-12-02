using berserk_online_server.DTO.Cards;
using berserk_online_server.DTO.Models;
using berserk_online_server.DTO.Requests;

namespace berserk_online_server.Interfaces
{
    public interface IDeckBuilder
    {
        Deck BuildFromDb(DeckDb deckDb);
        DeckDb BuildToDb(Deck deckDb);
        Deck BuildFromRequest(DeckRequest request);
    }
}
