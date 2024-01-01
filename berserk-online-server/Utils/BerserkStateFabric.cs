using berserk_online_server.Implementations.Gameplay;
using berserk_online_server.Implementations.Gameplay.States;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Fabrics;

namespace berserk_online_server.Utils
{
    public class BerserkStateFabric : IBerserkStateFabric
    {
        private readonly IPlayableCardFabric _playableCardFabric;
        private readonly IDeckDatabase _deckDb;
        public BerserkStateFabric(IPlayableCardFabric playableCardFabric, IDeckDatabase deckDatabase)
        {
            _deckDb = deckDatabase;
            _playableCardFabric = playableCardFabric;
        }

        public BerserkChooseCardsState CreateChooseCardsState(BerserkContext ctx)
        {
            return new BerserkChooseCardsState(ctx);
        }

        public BerserkDeckChooseState CreateDeckChooseState(BerserkContext ctx)
        {
            return new BerserkDeckChooseState(ctx, _playableCardFabric, _deckDb);
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
