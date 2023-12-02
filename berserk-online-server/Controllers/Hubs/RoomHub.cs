using berserk_online_server.Constants;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Rooms;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using berserk_online_server.Utils;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Controllers.Hubs
{
    public class RoomHub : Hub
    {
        private readonly IUserLocationManager _userLocationManager;
        private readonly IRoomsManager _roomsManager;
        private readonly IUsersDatabase _db;
        private readonly IConnectionGroupsManager _connectionManager;
        public RoomHub(IUserLocationManager locationManager, IUsersDatabase db,
            IRoomsManager roomsManager, IConnectionGroupsManager connectionManager)
        {
            _userLocationManager = locationManager;
            _db = db;
            _roomsManager = roomsManager;
            _connectionManager = connectionManager;
        }
        public override async Task OnConnectedAsync()
        {
            if (Context.User == null || !Context.User.Claims.Any())
                Context.Abort();
            await Clients.Caller.SendAsync(RoomHubMethodNames.ROOM_LIST, _roomsManager.GetAll());
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userInfo = getUserInfo();
            try
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, _userLocationManager.GetLocation(userInfo).Id);
                _userLocationManager.RemoveLocation(userInfo);
                _connectionManager.RemoveConnection(Context.ConnectionId);
                await base.OnDisconnectedAsync(exception);
            }
            catch (KeyNotFoundException)
            {
                await base.OnDisconnectedAsync(exception);
            }

        }
        public async Task SwitchToPlayer()
        {
            var user = getUserInfo();
            try
            {
                _roomsManager.ToPlayer(user);
            }
            catch (InvalidOperationException)
            {
                await sendErrorMessage(ApiErrorType.RoomIsFull, user);
            }
            catch (KeyNotFoundException)
            {
                await sendErrorMessage(ApiErrorType.NoAccess, "Invalid action");
            }
        }
        public async void SwitchToSpectator()
        {
            var user = getUserInfo();
            try
            {
                _roomsManager.ToSpectator(user);
            }
            catch (InvalidOperationException)
            {
                await sendErrorMessage(ApiErrorType.RoomIsFull, user);
            }
            catch (KeyNotFoundException)
            {
                await sendErrorMessage(ApiErrorType.NoAccess, "Invalid action");
            }
        }
        public async Task Connect(string roomId)
        {
            try
            {
                var room = _roomsManager.Get(roomId);
                _roomsManager.Join(getUserInfo(), roomId);
                _connectionManager.Add(Context.ConnectionId, roomId);
                await Clients.Caller.SendAsync(RoomHubMethodNames.ROOM_INFO, room);
            }
            catch (KeyNotFoundException)
            {
                await sendErrorMessage(ApiErrorType.NotFound, "room with this id not found.");
            }
        }
        public async Task Create(string name)
        {
            var room = await _roomsManager.Create(name, getUserInfo());
            await Clients.Caller.SendAsync(RoomHubMethodNames.ROOM_INFO, room);
            _connectionManager.Add(Context.ConnectionId, room.Id);
        }
        public async Task Leave()
        {
            try
            {
                await _roomsManager.Leave(getUserInfo());
                _connectionManager.RemoveConnection(Context.ConnectionId);
                await Clients.Caller.SendAsync(RoomHubMethodNames.ROOM_LIST, _roomsManager.GetAll());
            }
            catch (KeyNotFoundException)
            {
                await sendErrorMessage(ApiErrorType.NoAccess, "Not in room");
            }

        }
        public async Task GetAll()
        {
            await Clients.Caller.SendAsync(RoomHubMethodNames.ROOM_LIST, _roomsManager.GetAll());
        }
        private UserInfo getUserInfo()
        {
            return new UserInfo(_db.GetUser(new UserInfoRequest()
            {
                Email = IAuthenticationManager.GetMail(Context.User)
            }));
        }
        private async Task sendErrorMessage(ApiErrorType errorType, object? ctx = null)
        {
            await Clients.Caller
                .SendAsync(RoomHubMethodNames.ERROR, ApiErrorFabric.Create(errorType, ctx));
        }
    }
}
