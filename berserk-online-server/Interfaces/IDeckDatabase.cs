using berserk_online_server.Models.Cards;
using berserk_online_server.Models.Requests;

namespace berserk_online_server.Interfaces
{
    public interface IDeckDatabase
    {
        Deck[] GetAll(string email);
        Deck Get(string id);
        void Update(DeckRequest deck);
        Deck[] Delete(string email, string id);
        void Add(string email, DeckRequest deck);

    }
}
