using berserk_online_server.DTO;

namespace berserk_online_server.Data_objects.Gameplay
{
    public class PlayerSlot
    {
        public PlayerSlot(UserInfo user)
        {
            User = user;
        }
        public PlayerSlot() { }
        public UserInfo? User { get; set; }
        public bool IsReady { get; set; } = false;
    }
}
