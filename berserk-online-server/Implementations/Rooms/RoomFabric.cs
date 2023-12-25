using berserk_online_server.Implementations.Gameplay;
using berserk_online_server.Interfaces.Fabrics;
using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Implementations.Rooms
{
    public class RoomFabric : IRoomFabric
    {
        private IGroupDispatcherFabric _dispatcherFabric;
        public RoomFabric(IGroupDispatcherFabric dispatcherFabric)
        {
            _dispatcherFabric = dispatcherFabric;
        }

        public IRoom Create(string name, string id)
        {
            var room = new Room(name, id);
            room.GameplayContext = new BerserkContext(_dispatcherFabric, id);
            return room;
        }
    }
}
