using berserk_online_server.Models.Cards;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;

namespace berserk_online_server.Facades.CardBase
{
    public class DeckBuilder
    {
        private CardProvider _cardProvider;
        public DeckBuilder(CardProvider cardProvider)
        {
            _cardProvider = cardProvider;
        }
        public Deck BuildFromDb(DeckDb deckDb)
        {
            var deck = new Deck();
            deck.Id = deckDb.Id;
            deck.Name = deckDb.Name;
            if (deckDb.SideBoard != null)
                deck.SideBoard = _cardProvider.GetCards(deckDb.SideBoard);
            deck.Main = _cardProvider.GetCards(deckDb.Main);
            deck.Elements = deckDb.Elements;
            return deck;
        }
        public DeckDb PrepareForDb(Deck deck)
        {
            var dbDeck = new DeckDb();
            dbDeck.Id = deck.Id;
            dbDeck.Name = deck.Name;
            dbDeck.Elements = deck.Elements;
            dbDeck.Main = deck.Main.Select(card => card.Id).ToArray();
            if (deck.SideBoard != null)
            {
                dbDeck.SideBoard = deck.SideBoard.Select(card => card.Id).ToArray();
            }
            return dbDeck;
        }
        public Deck BuildFromRequest(DeckRequest request)
        {
            var deck = new Deck();
            deck.Main = request.Main;
            deck.SideBoard = request.SideBoard;
            deck.Name = request.Name;
            var allCards = request.Main;
            if (request.SideBoard != null)
            {
                allCards = allCards.Concat(request.SideBoard).ToArray();
            }
            if (request.Id != null)
            {
                deck.Id = (int)request.Id;
            }
            deck.Elements = getElements(allCards);
            return deck;
        }
        private string[] getElements(DeserealizedCard[] cards)
        {
            var elements = new HashSet<string>();
            foreach (var card in cards)
            {
                foreach (var element in card.Element)
                {
                    elements.Add(element);
                }
            }
            return elements.ToArray();
        }
    }
}
