using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.DTO;
using berserk_online_server.Interfaces.Rooms;
using berserk_online_server.Utils;

namespace berserk_online_server.Facades.Rooms
{
    public class RoomsManager : IRoomsManager
    {                     //roomId
        private readonly Dictionary<string, IRoom> _rooms = new();
        private readonly IUserLocationManager _userLocationManager;
        private readonly IGroupDispatcher<RoomEvent> _roomDispatcher;
        private readonly ILogger<RoomsManager> _logger;
        private readonly IRoomListDispatcher _roomListDispatcher;
        private const int CLEARING_DELAY_MS = 1 * 1000 * 60;

        public RoomsManager(IUserLocationManager userLocationManager, IGroupDispatcher<RoomEvent> dispatcher,
            ILogger<RoomsManager> logger, IRoomListDispatcher roomListDispatcher)
        {
            _userLocationManager = userLocationManager;
            _roomDispatcher = dispatcher;
            _logger = logger;
            _roomListDispatcher = roomListDispatcher;
            new Timer(async (state) =>
            {
                foreach (IRoom room in _rooms.Values)
                {
                    await garbageRoomCheck(room);
                }
            }, null, CLEARING_DELAY_MS, CLEARING_DELAY_MS);
        }
        public async Task<IRoom> Create(string name)
        {
            var roomId = TokenGenerator.Generate();
            var room = new Room(name, roomId);
            if (!_rooms.TryAdd(roomId, room))
                throw new InvalidOperationException("id already taken");
            subscribeDispatchers(room);
            await _roomListDispatcher.Dispatch(new RoomsListEvent()
            {
                Subject = room,
                Type = RoomListEventTypes.ROOM_CREATED
            });
            _logger.LogInformation($"Created room with id: {room.Id}");
            return room;
        }
        public IRoom Get(string id)
        {
            return _rooms[id] ?? throw new KeyNotFoundException("room with this id not found");
        }

        public IRoom[] GetAll()
        {
            return _rooms.Values.ToArray();
        }

        public void Join(UserInfo user, string roomId)
        {
            var room = Get(roomId);
            _userLocationManager.ChangeLocation(user, room);
            try
            {
                room.AddPlayer(user);
            }
            catch (InvalidOperationException)
            {
                room.AddSpectator(user);
            }
            _logger.LogInformation($"Added user {user.Email} to room with id: {room.Id}");
        }
        public async Task Leave(UserInfo user)
        {
            var room = _userLocationManager.GetLocation(user);
            _userLocationManager.RemoveLocation(user);
            await garbageRoomCheck(room);
        }

        public void ToPlayer(UserInfo user)
        {
            var room = _userLocationManager.GetLocation(user);
            room.MoveToPlayers(user);
        }

        public void ToSpectator(UserInfo user)
        {
            var room = _userLocationManager.GetLocation(user);
            room.MoveToSpectators(user);
        }
        private async Task garbageRoomCheck(IRoom room)
        {
            if (!room.Players.Any(el => el != null) && room.Spectators.Count == 0)
            {
                _rooms.Remove(room.Id);
                _logger.LogInformation($"Room with id {room.Id} and name {room.Name} removed.");
                await _roomListDispatcher.Dispatch(new RoomsListEvent()
                {
                    Subject = room,
                    Type = RoomListEventTypes.ROOM_REMOVED
                });
            }
        }
        private void subscribeDispatchers(IRoom room)
        {
            room.OnChanges += async roomEvent =>
            {
                await _roomDispatcher.Dispatch(roomEvent, room.Id);
            };
            room.OnChanges += async _ =>
            {
                await _roomListDispatcher.DispatchList(GetAll());
            };
        }
    }
}
