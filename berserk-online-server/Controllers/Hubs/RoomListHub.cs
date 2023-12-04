using berserk_online_server.Constants;
using berserk_online_server.DTO;
using berserk_online_server.DTO.Requests;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Rooms;
using berserk_online_server.Utils;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Controllers.Hubs
{
    public class RoomListHub : Hub
    {
        private readonly IRoomsManager _roomsManager;
        private readonly IUsersDatabase _db;
        private readonly IConnectionGroupsManager _connectionManager;
        public RoomListHub(IUsersDatabase db, IRoomsManager roomsManager, IConnectionGroupsManager connectionManager)
        {
            _db = db;
            _roomsManager = roomsManager;
            _connectionManager = connectionManager;
        }
        public override async Task OnConnectedAsync()
        {
            if (Context.User == null || !Context.User.Claims.Any())
                Context.Abort();
            await Clients.Caller.SendAsync(RoomHubMethodNames.ROOMS_LIST, _roomsManager.GetAll());
            await base.OnConnectedAsync();
        }
        public async Task Create(string name)
        {
            var room = await _roomsManager.Create(name);
        }

        public async Task GetAll()
        {
            await Clients.Caller.SendAsync(RoomHubMethodNames.ROOMS_LIST, _roomsManager.GetAll());
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
