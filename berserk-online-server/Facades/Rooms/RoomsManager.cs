using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Interfaces.Rooms;
using berserk_online_server.Models.Db;
using berserk_online_server.Utils;

namespace berserk_online_server.Facades.Rooms
{
    public class RoomsManager : IRoomsManager
    {                     //roomId
        private readonly Dictionary<string, IRoom> _rooms = new();
        private readonly IUserLocationManager _userLocationManager;
        private readonly IGroupDispatcher<RoomEvent> _roomDispatcher;
        private readonly ILogger<RoomsManager> _logger;
        private readonly IDispatcher<RoomListEvent> _roomListDispatcher;
        private const int CLEARING_DELAY_MS = 1 * 1000 * 60;

        public RoomsManager(IUserLocationManager userLocationManager, IGroupDispatcher<RoomEvent> dispatcher,
            ILogger<RoomsManager> logger, IDispatcher<RoomListEvent> roomListDispatcher)
        {
            _userLocationManager = userLocationManager;
            _roomDispatcher = dispatcher;
            _logger = logger;
            _roomListDispatcher = roomListDispatcher;
            new Timer(async (state) =>
            {
                foreach (Room room in _rooms.Values)
                {
                    await garbageRoomCheck(room);
                }
            }, null, CLEARING_DELAY_MS, CLEARING_DELAY_MS);
        }
        public async Task<IRoom> Create(string name, UserInfo creator)
        {
            var id = TokenGenerator.Generate();
            var room = new Room(name, id);
            if (!_rooms.TryAdd(id, room))
                throw new InvalidOperationException("id already taken");
            room.OnChanges += async (roomEvent) =>
            {
                await _roomDispatcher.Dispatch(roomEvent, id);
            };
            room.AddPlayer(creator);
            _userLocationManager.ChangeLocation(creator, room);
            await _roomListDispatcher.Dispatch(new RoomListEvent()
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
            try
            {
                room.AddPlayer(user);
            }
            catch (InvalidOperationException)
            {
                room.AddSpectator(user);
            }
            _logger.LogInformation($"Added user {user.Email} to room with id: {room.Id}");
            _userLocationManager.ChangeLocation(user, room);
        }
        public async Task Leave(UserInfo user, string roomId)
        {
            _userLocationManager.RemoveLocation(user);
            await garbageRoomCheck(Get(roomId));
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
            if (room.Players.Item1 == null && room.Players.Item2 == null && room.Spectators.Count == 0)
            {
                _rooms.Remove(room.Id);
                await _roomListDispatcher.Dispatch(new RoomListEvent()
                {
                    Subject = room,
                    Type = RoomListEventTypes.ROOM_REMOVED
                });
            }
        }
    }
}
