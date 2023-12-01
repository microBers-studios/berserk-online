using berserk_online_server.Models.Db;

namespace berserk_online_server.Data_objects.Rooms
{
    public class RoomEvent
    {
        public string Type { get; set; }
        public UserInfo Initiator { get; set; }
    }
}
