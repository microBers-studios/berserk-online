namespace berserk_online_server.Interfaces.Gameplay
{
    public interface IGameplayContext
    {
        void Handle(Enum type, object arg);
    }
}
