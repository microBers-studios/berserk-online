using berserk_online_server.Data_objects.Cards;
using berserk_online_server.DTO.Cards;
using berserk_online_server.Interfaces.Fabrics;

namespace berserk_online_server.Implementations.Gameplay
{
    public class PlayableSideContext
    {
        public byte Owner { get; }
        public List<PlayableCard> Deck { get; private set; }
        public List<PlayableCard> Graveyard { get; } = new List<PlayableCard>();
        public List<PlayableCard> Exile { get; } = new List<PlayableCard>();
        public List<PlayableCard> Flying { get; } = new List<PlayableCard>();
        public PlayableSideContext(DeckCardInfo[] cards, IPlayableCardFabric cardFabric, byte owner)
        {
            Deck = cards.Select(c => cardFabric.Create(c.Id, owner)).ToList();
            Owner = owner;
        }
        public PlayableSideContext(PlayableCard[] cards, byte owner)
        {
            Deck = cards.ToList();
            Owner = owner;
        }
    }
}
