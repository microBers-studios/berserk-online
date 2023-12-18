﻿using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.DTO;
using berserk_online_server.DTO.Cards;
using berserk_online_server.DTO.Requests;
using berserk_online_server.Implementations.Rooms;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Rooms;
using berserk_online_server.Utils;
using Microsoft.AspNetCore.SignalR;
using System.Security.Cryptography.Xml;

namespace berserk_online_server.Controllers.Hubs
{
    public class RoomHub : Hub
    {
        private readonly ICancellationTokenManager<string> _cancellationTokenManager;
        private readonly IRoomsManager _roomsManager;
        private readonly IUsersDatabase _db;
        private readonly IConnectionGroupsManager _connectionManager;
        private readonly ILogger<RoomHub> _logger;
        private readonly IUserLocationManager _userLocationManager;
        private const int CONNECTION_TIMEOUT = 10000;
        public RoomHub(IRoomsManager roomsManager, IUsersDatabase usersDatabase,
            IConnectionGroupsManager connectionManager, ILogger<RoomHub> logger,
            ICancellationTokenManager<string> cancellationTokenManager,
            IUserLocationManager userLocationManager)
        {
            _roomsManager = roomsManager;
            _db = usersDatabase;
            _connectionManager = connectionManager;
            _logger = logger;
            _cancellationTokenManager = cancellationTokenManager;
            _userLocationManager = userLocationManager;
        }
        public override async Task OnConnectedAsync()
        {
            var roomId = getRoomIdFromURL();
            try
            {
                var email = getUserInfo().Email;
                _cancellationTokenManager.TryCancel(email);
                _roomsManager.Join(getUserInfo(), roomId);
                _connectionManager.Add(Context.ConnectionId, roomId);
                var room = _roomsManager.Get(roomId);
                await Clients.Caller.SendAsync(RoomHubMethodNames.ROOM_INFO, RoomMapper.ToInfo(room));
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
            try
            {
                _cancellationTokenManager.AddToken(user.Email, token);
                var room = _userLocationManager.GetLocation(user);
                if (room.Players.Any(u => u?.Id == user.Id))
                {
                    Task.Factory.StartNew(() => processTimeout(user, token.Token));
                }
            }
            catch (KeyNotFoundException) { }
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
                var user = getUserInfo();
                _logger.LogInformation($"Пользователь {user.Email} запросил выход из комнаты.");
                await _roomsManager.Leave(user);
                _connectionManager.RemoveConnection(Context.ConnectionId);
            }
            catch (KeyNotFoundException)
            {
                await sendErrorMessage(ApiErrorType.NoAccess, "Not in room");
            }

        }
        public async Task SendChatMessage(string message)
        {
            var user = getUserInfo();
            var room = _userLocationManager.GetLocation(user);
            var connections = _connectionManager.GetConnections(room.Id);
            var chatMessage = new ChatMessage()
            {
                Content = message,
                Sender = user,
                Id = Guid.NewGuid().ToString(),
            };
            room.Chat.AddMessage(chatMessage);
            await Clients.Clients(connections).SendAsync(RoomHubMethodNames.CHAT_EVENT, chatMessage);
        }
        private void processTimeout(UserInfo user, CancellationToken token)
        {
            Thread.Sleep(CONNECTION_TIMEOUT);
            if (!token.IsCancellationRequested)
            {
                try
                {
                    _roomsManager.Leave(user);
                    _logger.LogWarning($"Пользователь {user.Email} вышел из комнаты из-за бездействия.");
                }
                catch (KeyNotFoundException)
                {
                    _logger.LogWarning("Key not found");
                }
            }
        }
        private UserInfo getUserInfo()
        {
            return new UserInfo(_db.GetUser(new UserInfoRequest()
            {
                Email = IAuthenticationManager.GetMail(Context.User!)
            }));
        }
        private async Task sendErrorMessage(ApiErrorType errorType, object? ctx = null)
        {
            await Clients.Caller
                .SendAsync(RoomHubMethodNames.ERROR, ApiErrorFabric.Create(errorType, ctx));
        }
        private string getRoomIdFromURL()
        {
            var urlValue = Context.GetHttpContext()!.Request.Path.Value!.Split("/")[2];
            return urlValue.Split('?')[0];
        }
    }
}