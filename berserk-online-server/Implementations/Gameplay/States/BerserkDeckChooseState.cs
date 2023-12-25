using berserk_online_server.Constants;
using berserk_online_server.DTO.Cards;
using berserk_online_server.Interfaces.Dispatchers;
using berserk_online_server.Interfaces.Fabrics;
using berserk_online_server.Interfaces.Gameplay;

namespace berserk_online_server.Implementations.Gameplay.States
{
    public class BerserkDeckChooseState : BerserkGameplayState
    {

        private IPlayableCardFabric _cardFabric;
        public BerserkDeckChooseState(BerserkContext context, IPlayableCardFabric cardFabric, IGroupInvoker invoker) : base(context)
        {
            _cardFabric = cardFabric;
            invoker.InvokeClientAsync(GameplayEventNames.CHOOSE_DECK, context.RoomId);
        }
        public override void SetDeck(Deck deck, byte owner)
        {
            if (owner < 0 || owner > 1) throw new ArgumentOutOfRangeException();
            Context.SideContexts[owner] = new PlayableSideContext(deck.Main, _cardFabric, owner);
            checkStateSwitch();
        }

        private void checkStateSwitch()
        {
            if (Context.SideContexts.All(c => c != null))
            {
                Context.ChangeState(new BerserkFieldPreparingState(Context));
            }
        }
    }
}
