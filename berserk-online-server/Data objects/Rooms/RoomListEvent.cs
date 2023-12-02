using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Data_objects.Rooms
{
    public class RoomListEvent
    {
        public string Type { get; set; }
        public IRoom Subject { get; set; }
    }
}
