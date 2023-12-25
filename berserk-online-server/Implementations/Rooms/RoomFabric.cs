using berserk_online_server.Constants;
using berserk_online_server.Implementations.Gameplay;
using berserk_online_server.Interfaces.Fabrics;
using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Implementations.Rooms
{
    public class RoomFabric : IRoomFabric
    {
        private readonly IGroupDispatcherFabric _dispatcherFabric;
        private readonly IBerserkStateFabric _stateFabric;
        private readonly IUserLocationManager _userLocationManager;
        public RoomFabric(IGroupDispatcherFabric dispatcherFabric, IBerserkStateFabric stateFabric, IUserLocationManager locationManager)
        {
            _dispatcherFabric = dispatcherFabric;
            _stateFabric = stateFabric;
            _userLocationManager = locationManager;
        }

        public IRoom Create(string name, RoomType type, string id)
        {
            var room = new Room(name, id, type);
            room.GameplayContext = new BerserkContext(_dispatcherFabric, _stateFabric, _userLocationManager, id);
            return room;
        }
    }
}
