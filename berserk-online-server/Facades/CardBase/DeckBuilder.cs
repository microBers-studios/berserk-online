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
                deck.SideBoard = deckDb.Main.Select(convertFromCardCode).ToArray();
            deck.Main = deckDb.Main.Select(convertFromCardCode).ToArray();
            deck.Elements = deckDb.Elements;
            return deck;
        }
        public DeckDb PrepareForDb(Deck deck)
        {
            var dbDeck = new DeckDb();
            dbDeck.Id = deck.Id;
            dbDeck.Name = deck.Name;
            dbDeck.Elements = deck.Elements;
            dbDeck.Main = deck.Main.Select(convertToCardCode).ToArray();
            if (deck.SideBoard != null)
            {
                dbDeck.SideBoard = deck.SideBoard.Select(convertToCardCode).ToArray();
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
                deck.Id = request.Id;
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
        private DeckCardInfo convertFromCardCode(string code)
        {
            var values = code.Split('-').Select(x => int.Parse(x)).Take(2).ToArray();
            var card = new DeckCardInfo(_cardProvider.GetCard(values[0]));
            if (card == null)
                throw new ArgumentNullException();
            card.Amount = values[1];
            return card;
        }
        private string convertToCardCode(DeckCardInfo card)
        {
            return $"{card.Id}-{card.Amount}";
        }
    }
}
