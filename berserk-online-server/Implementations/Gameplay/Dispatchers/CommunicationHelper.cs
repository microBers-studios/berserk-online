using berserk_online_server.Controllers.Hubs;
using berserk_online_server.DTO;
using berserk_online_server.Interfaces.Gameplay;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Implementations.Gameplay.Dispatchers
{
    public class CommunicationHelper : ICommunicationHelper
    {
        private readonly IUserLocationManager _userLocationManager;
        private readonly IRoomsManager _roomsManager;
        private readonly IHubContext<RoomHub> _hubContext;
        public CommunicationHelper(IUserLocationManager locationManager, IRoomsManager roomsManager, IHubContext<RoomHub> context)
        {
            _userLocationManager = locationManager;
            _roomsManager = roomsManager;
            _hubContext = context;
        }
        public string RoomId { get; set; }

        public void SendActionAllPlayers(string actionName)
        {
            var connections = getPlayersConnections();
            _hubContext.Clients.Clients(connections).SendAsync(actionName);
        }

        public void SendActionGroup(string actionName)
        {
            var connections = getGroupConnections();
            _hubContext.Clients.Clients(connections).SendAsync(actionName);
        }

        public void SendActionPlayer(string actionName, sbyte owner)
        {
            var connection = getPlayerConnection(owner);
            _hubContext.Clients.Client(connection).SendAsync(actionName);
        }

        public void SendMessageAllPlayers<T>(string actionName, T message)
        {
            var connections = getPlayersConnections();
            _hubContext.Clients.Clients(connections).SendAsync(actionName, message);
        }

        public void SendMessageGroup<T>(string actionName, T message)
        {
            var connections = getGroupConnections();
            _hubContext.Clients.Clients(connections).SendAsync(actionName, message);
        }

        public void SendMessagePlayer<T>(string actionName, T message, sbyte owner)
        {
            var connection = getPlayerConnection(owner);
            _hubContext.Clients.Client(connection).SendAsync(actionName, message);
        }
        public UserInfo GetPlayer(sbyte owner)
        {
            var room = _roomsManager.Get(RoomId);
            return room.Players.Select(p => p.User).ElementAt(owner) ?? throw new ArgumentNullException();
        }
        private string[] getPlayersConnections()
        {
            var room = _roomsManager.Get(RoomId);
            return room.Players.Where(p => p.User != null)
                .Select(p => _userLocationManager.GetConnection(p.User))
                .ToArray();
        }
        private string getPlayerConnection(sbyte owner)
        {
            var room = _roomsManager.Get(RoomId);
            return room.Players.Select(p => _userLocationManager.GetConnection(p.User)).ElementAt(owner);
        }
        private string[] getGroupConnections()
        {
            var room = _roomsManager.Get(RoomId);
            List<UserInfo> allUsers = new List<UserInfo>(room.Spectators);
            allUsers.AddRange(room.Players.Where(p => p.User != null).Select(p => p.User)!);
            return allUsers.Select(_userLocationManager.GetConnection).ToArray();
        }
    }
}
