using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.DTO;

namespace berserk_online_server.Data_objects.Rooms
{
    public class RoomOverview
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public PlayerSlot?[] Players { get; set; }
        public UserInfo[] Spectators { get; set; }
    }
}
