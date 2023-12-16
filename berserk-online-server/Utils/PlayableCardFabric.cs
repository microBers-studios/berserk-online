using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Interfaces;

namespace berserk_online_server.Utils
{
    public class PlayableCardFabric : IPlayableCardFabric
    {
        private ICardProvider _cardProvider;
        public PlayableCardFabric(ICardProvider cardProvider)
        {
            _cardProvider = cardProvider;
        }
        public PlayableCard Create(int id, byte owner)
        {
            var card = _cardProvider.GetCard(id);
            return new PlayableCard(owner, id, GetCardType(card.Type), card.Image);
        }
        private CardType GetCardType(string type)
        {
            switch (type)
            {
                case "creature":
                    return CardType.Regular;
                case "flyer":
                    return CardType.Flying;
                case "companion":
                    return CardType.Symbiote;
            }
            throw new NotImplementedException();
        }
    }
}
