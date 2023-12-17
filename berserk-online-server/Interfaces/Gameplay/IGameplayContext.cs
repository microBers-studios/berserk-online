namespace berserk_online_server.Interfaces.Gameplay
{
    public interface IGameplayContext
    {
        public string ConnectionsGroupId { get; set; }
        void Handle(Enum type, object arg, byte owner);
    }
}
