using berserk_online_server.Data_objects.Rooms;

namespace berserk_online_server.Interfaces.Rooms
{
    public interface IRoomUpdateDispatcher
    { 
        public void Dispatch(RoomEvent roomEvent, string roomId);
    }
}
