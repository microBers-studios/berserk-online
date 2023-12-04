using berserk_online_server.Constants;
using berserk_online_server.DTO;
using berserk_online_server.DTO.Models;
using berserk_online_server.DTO.Requests;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Rooms;
using berserk_online_server.Utils;
using Microsoft.AspNetCore.SignalR;
using System.Runtime.CompilerServices;
using System.Threading;

namespace berserk_online_server.Controllers.Hubs
{
    public class RoomHub : Hub
    {
        private readonly ICancellationTokenManager<string> _cancellationTokenManager;
        private readonly IRoomsManager _roomsManager;
        private readonly IUsersDatabase _db;
        private readonly IConnectionGroupsManager _connectionManager;
        private readonly ILogger<RoomHub> _logger;
        private const int CONNECTION_TIMEOUT = 10000;
        public RoomHub(IRoomsManager roomsManager, IUsersDatabase usersDatabase,
            IConnectionGroupsManager connectionManager, ILogger<RoomHub> logger, ICancellationTokenManager<string> cancellationTokenManager)
        {
            _roomsManager = roomsManager;
            _db = usersDatabase;
            _connectionManager = connectionManager;
            _logger = logger;
            _cancellationTokenManager = cancellationTokenManager;
        }
        public override async Task OnConnectedAsync()
        {
            var roomId = getRoomIdFromURL();
            try
            {
                var email = getUserInfo().Email;
                _cancellationTokenManager.TryCancel(email);
                var room = _roomsManager.Get(roomId);
                _roomsManager.Join(getUserInfo(), roomId);
                _connectionManager.Add(Context.ConnectionId, roomId);
                await Clients.Caller.SendAsync(RoomHubMethodNames.ROOM_INFO, room);
                await base.OnConnectedAsync();
            }
            catch (KeyNotFoundException)
            {
                await sendErrorMessage(ApiErrorType.NotFound, "room with this id not found");
                Context.Abort();
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex.ToString());
                Context.Abort();
            }
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var token = new CancellationTokenSource();
            var user = getUserInfo();
            _connectionManager.RemoveConnection(Context.ConnectionId);
            _cancellationTokenManager.AddToken(user.Email, token);
            new Timer(async state =>
            {
                var token = (CancellationToken)state;
                if (!token.IsCancellationRequested)
                {
                    try
                    {
                        await _roomsManager.Leave(user);
                    }
                    catch (KeyNotFoundException)
                    {
                        _logger.LogWarning("Key not found");
                    }
                }
            }, token.Token, CONNECTION_TIMEOUT, Timeout.Infinite);
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
        public async Task Leave()
        {
            try
            {
                await _roomsManager.Leave(getUserInfo());
                _connectionManager.RemoveConnection(Context.ConnectionId);
            }
            catch (KeyNotFoundException)
            {
                await sendErrorMessage(ApiErrorType.NoAccess, "Not in room");
            }

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
        private string getRoomIdFromURL()
        {
            var urlValue = Context.GetHttpContext().Request.Path.Value.Split("/")[2];
            return urlValue.Split('?')[0];
        }
    }
}
