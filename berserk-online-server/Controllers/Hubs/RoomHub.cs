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
        public RoomHub(IUserLocationManager locationManager, IUsersDatabase db,
            IRoomsManager roomsManager)
        {
            _userLocationManager = locationManager;
            _db = db;
            _roomsManager = roomsManager;
        }
        public override async Task OnConnectedAsync()
        {
            if (Context.User == null || !Context.User.Claims.Any())
                Context.Abort();
            try
            {
                var roomId = resolveRoomId();
                var room = _roomsManager.Get(roomId);
                _roomsManager.Join(getUserInfo(), roomId);
                await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
                await base.OnConnectedAsync();
                await Clients.Caller.SendAsync(RoomHubMethodNames.ROOM_INFO, room);
            }
            catch (KeyNotFoundException)
            {
                var room = _roomsManager.Create(resolveRoomId(), getUserInfo());
                await Groups.AddToGroupAsync(Context.ConnectionId, room.Id);
                await base.OnConnectedAsync();
                await Clients.Caller.SendAsync(RoomHubMethodNames.ROOM_INFO, room);
            }
            catch (Exception)
            {
                Context.Abort();
            }
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, resolveRoomId());
            var userInfo = getUserInfo();
            _userLocationManager.RemoveLocation(userInfo);
            await base.OnDisconnectedAsync(exception);
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
        }
        private string resolveRoomId()
        {
            var httpContext = Context.GetHttpContext();
            var groupId = httpContext.Request.Path.Value.Split('/')[2] ?? throw new ArgumentNullException();
            return groupId;
        }
        private UserInfo getUserInfo()
        {
            return new UserInfo(_db.GetUser(new UserInfoRequest()
            {
                Email = IAuthenticationManager.GetMail(Context.User)
            }));
        }
        private async Task sendErrorMessage(ApiErrorType errorType, UserInfo user)
        {
            var roomId = _userLocationManager.GetLocation(user).Id;
            await Clients.Group(roomId)
                .SendAsync(RoomHubMethodNames.ERROR, ApiErrorFabric.Create(errorType));
        }
    }
}
