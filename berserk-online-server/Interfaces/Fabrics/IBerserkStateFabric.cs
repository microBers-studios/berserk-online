using berserk_online_server.Implementations.Gameplay;
using berserk_online_server.Implementations.Gameplay.States;

namespace berserk_online_server.Interfaces.Fabrics
{
    public interface IBerserkStateFabric
    {
        BerserkGameNotStartedState CreateGameNotStarted(BerserkContext ctx);
        BerserkDeckChooseState CreateDeckChooseState(BerserkContext ctx);
        BerserkFieldPreparingState CreateFieldPreparingState(BerserkContext ctx);
        BerserkPlayerTurn CreatePlayerTurn(BerserkContext ctx, byte owner);
        BerserkChooseCardsState CreateChooseCardsState(BerserkContext ctx);
    }
}