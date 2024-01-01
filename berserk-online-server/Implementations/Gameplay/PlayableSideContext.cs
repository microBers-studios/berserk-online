using berserk_online_server.Data_objects.Cards;
using berserk_online_server.DTO.Cards;
using berserk_online_server.Interfaces.Fabrics;

namespace berserk_online_server.Implementations.Gameplay
{
    public class PlayableSideContext
    {
        public sbyte Owner { get; }
        public List<PlayableCard> Deck { get; private set; }
        public List<PlayableCard> Graveyard { get; } = new List<PlayableCard>();
        public List<PlayableCard> Exile { get; } = new List<PlayableCard>();
        public List<PlayableCard> Flying { get; } = new List<PlayableCard>();
        public List<PlayableCard> Hand { get; set; } = new List<PlayableCard> { };
        public PlayableSideContext(DeckCardInfo[] cards, IPlayableCardFabric cardFabric, sbyte owner)
        {
            var deck = new List<PlayableCard>(); 
            foreach (var card in cards)
            {
                for (int i = 0; i < card.Amount; i++)
                {
                    deck.Add(cardFabric.Create(card.Id, owner));
                }
            }
            Deck = deck;
            Owner = owner;
        }
        public PlayableSideContext(PlayableCard[] cards, sbyte owner)
        {
            Deck = cards.ToList();
            Owner = owner;
        }
    }
}
