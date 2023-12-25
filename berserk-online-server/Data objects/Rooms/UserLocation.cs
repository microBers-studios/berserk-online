using berserk_online_server.DTO;
using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Data_objects.Rooms
{
    public class UserLocation
    { 
        public string ConnectionId { get; set; }
        public IRoom Room { get; set; }
    }
}
