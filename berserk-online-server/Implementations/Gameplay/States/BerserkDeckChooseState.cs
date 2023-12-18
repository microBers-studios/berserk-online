using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.DTO.Cards;
using berserk_online_server.Interfaces.Dispatchers;
using berserk_online_server.Interfaces.Fabrics;
using berserk_online_server.Interfaces.Gameplay;
using System.Drawing;

namespace berserk_online_server.Implementations.Gameplay.States
{
    public class BerserkDeckChooseState : BerserkGameplayState
    {

        private IPlayableCardFabric _cardFabric;
        public BerserkDeckChooseState(BerserkContext context, IPlayableCardFabric cardFabric, IGroupInvoker invoker) : base(context)
        {
            _cardFabric = cardFabric;
            invoker.InvokeClientAsync(GameplayActionNames.CHOOSE_DECK);
        }

        public override void AddChip(Point point, Chip chip)
        {
            throwInvalidOperation();
        }

        public override void AddChipToCard(Point point, Chip type)
        {
            throw new NotImplementedException();
        }

        public override void AddExileCard(PlayableCard card, byte owner)
        {
            throwInvalidOperation();
        }

        public override void AddGraveyardCard(byte owner, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public override void AddSymbioteToCard(Point point, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public override void EditChip(Point point, Chip chip, int id)
        {
            throwInvalidOperation();
        }

        public override void FlipCard(Point point)
        {
            throwInvalidOperation();
        }

        public override void MoveFieldCard(Point oldPoint, Point newPoint, byte owner)
        {
            throwInvalidOperation();
        }

        public override void RemoveChip(Point point, Chip chip)
        {
            throwInvalidOperation();
        }

        public override void RemoveExileCard(PlayableCard card, byte owner)
        {
            throwInvalidOperation();
        }

        public override void RemoveFieldCard(Point point, byte owner)
        {
            throwInvalidOperation();
        }

        public override void RemoveGraveyardCard(byte owner, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public override void RemoveSymbioteFromCard(Point point, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public override void SetDeck(Deck deck, byte owner)
        {
            if (owner < 0 || owner > 1) throw new ArgumentOutOfRangeException();
            Context.SideContexts[owner] = new PlayableSideContext(deck.Main, _cardFabric, owner);
            checkContextSwitch();
        }
        public override void SetFieldCard(Point point, PlayableCard card, byte owner)
        {
            throwInvalidOperation();
        }

        public override void TapCard(Point point)
        {
            throwInvalidOperation();
        }

        private void checkContextSwitch()
        {
            if (Context.SideContexts.All(c => c != null))
            {
                Context.ChangeState(new BerserkFieldPreparingState(Context));
            }
        }
    }
}
