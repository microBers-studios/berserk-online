namespace berserk_online_server.Interfaces.Gameplay
{
    public interface IGameplayContext
    {
        public ICommunicationHelper CommunicationHelper { get; }
        void Handle(Enum type, object arg, sbyte owner);
        void StartGame();
        object Get(Enum type, object arg, sbyte owner);
    }
}
