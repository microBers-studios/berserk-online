using berserk_online_server.Implementations.Gameplay;
using berserk_online_server.Implementations.Gameplay.States;
using berserk_online_server.Interfaces.Dispatchers;
using berserk_online_server.Interfaces.Fabrics;

namespace berserk_online_server.Utils
{
    public class BerserkStateFabric : IBerserkStateFabric
    {
        private readonly IPlayableCardFabric _playableCardFabric;
        private readonly IGroupInvoker _groupInvoker;
        public BerserkStateFabric(IPlayableCardFabric playableCardFabric, IGroupInvoker groupInvoker)
        {
            _playableCardFabric = playableCardFabric;
            _groupInvoker = groupInvoker;
        }
        public BerserkDeckChooseState CreateDeckChooseState(BerserkContext ctx)
        {
            return new BerserkDeckChooseState(ctx, _playableCardFabric, _groupInvoker);
        }

        public BerserkFieldPreparingState CreateFieldPreparingState(BerserkContext ctx)
        {
            return new BerserkFieldPreparingState(ctx);
        }

        public BerserkGameNotStartedState CreateGameNotStarted(BerserkContext ctx)
        {
            return new BerserkGameNotStartedState(ctx);
        }

        public BerserkPlayerTurn CreatePlayerTurn(BerserkContext ctx, byte owner)
        {
            return new BerserkPlayerTurn(ctx, owner);
        }
    }
}
