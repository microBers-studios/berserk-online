using berserk_online_server.Constants;
using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Interfaces.Fabrics
{
    public interface IRoomFabric
    {
        void Init(IUserLocationManager userLocationManager, IRoomsManager roomsManager);
        IRoom Create(string name, RoomType type, string id);
    }
}
