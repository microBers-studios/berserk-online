using berserk_online_server.Constants;
using berserk_online_server.Interfaces.Gameplay;

namespace berserk_online_server.Implementations.Gameplay.States
{
    public class BerserkGameNotStartedState : BerserkGameplayState
    {
        public BerserkGameNotStartedState(BerserkContext context) : base(context)
        {
        }
        public override void StartGame()
        {
            Context.CommunicationHelper.SendActionGroup(GameplayClientActionNames.START_GAME);
            var state = Context.StateFabric.CreateDeckChooseState(Context);
            Context.ChangeState(state);
        }
    }
}
