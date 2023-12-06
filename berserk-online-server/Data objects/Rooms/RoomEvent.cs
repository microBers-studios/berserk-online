using berserk_online_server.DTO;

namespace berserk_online_server.Data_objects.Rooms
{
    public class RoomEvent
    {
        public string Type { get; set; }
        public UserInfo Initiator { get; set; }
        public string TimeStamp { get; } = DateTime.Now.ToLongTimeString();
        public string Id { get; set; } = Guid.NewGuid().ToString();
    }
}
