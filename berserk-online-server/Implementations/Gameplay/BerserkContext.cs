using berserk_online_server.Interfaces.Gameplay;

namespace berserk_online_server.Implementations.Gameplay
{
    public class BerserkContext : IGameplayContext
    {
        public PlayableSideContext[] SideContexts { get; } = new PlayableSideContext[2];
        public BerserkField Field { get; } = new BerserkField();
        public BerserkGameplayState State { get; private set; }

        public void ChangeState(BerserkGameplayState state)
        {
            State = state;
        }

        public void Handle(Enum type, object arg)
        {
            throw new NotImplementedException();
        }
    }
}
