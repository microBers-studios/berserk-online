using berserk_online_server.Constants;
using berserk_online_server.Controllers.Hubs;
using berserk_online_server.Implementations.Gameplay;
using berserk_online_server.Implementations.Gameplay.Dispatchers;
using berserk_online_server.Interfaces.Fabrics;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Implementations.Rooms
{
    public class RoomFabric : IRoomFabric
    {
        private readonly IGroupDispatcherFabric _dispatcherFabric;
        private readonly IBerserkStateFabric _stateFabric;
        private readonly IHubContext<RoomHub> _hubContext;
        private IRoomsManager _roomsManager;
        private IUserLocationManager _userLocationManager;
        public RoomFabric(IGroupDispatcherFabric dispatcherFabric, IBerserkStateFabric stateFabric, IHubContext<RoomHub> hubContext)
        {
            _dispatcherFabric = dispatcherFabric;
            _stateFabric = stateFabric;
            _hubContext = hubContext;
        }

        public IRoom Create(string name, RoomType type, string id)
        {
            var room = new Room(name, id, type);
            var communicationHelper = new CommunicationHelper(_userLocationManager, _roomsManager, _hubContext);
            room.GameplayContext = new BerserkContext(room, _dispatcherFabric, communicationHelper, 
                _stateFabric, new EventCommunicator(communicationHelper));
            return room;
        }

        public void Init(IUserLocationManager userLocationManager, IRoomsManager roomsManager)
        {
            _roomsManager = roomsManager;
            _userLocationManager = userLocationManager;
        }
    }
}
