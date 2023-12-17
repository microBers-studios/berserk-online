using berserk_online_server.Controllers.Hubs;
using berserk_online_server.Interfaces.Dispatchers;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Implementations.Gameplay.Dispatchers
{
    public class GameplayUpdateDispatcher<T> : IGroupDispatcher<T>
    {
        private readonly IHubContext<RoomHub> _context;
        private readonly IConnectionGroupsManager _connectionGroupsManager;
        private readonly string _groupId;
        public GameplayUpdateDispatcher(IHubContext<RoomHub> context, IConnectionGroupsManager connectionGroupsManager, string groupId)
        {
            _connectionGroupsManager = connectionGroupsManager;
            _context = context;
            _groupId = groupId;
        }
        public async Task DispatchAsync(T message, string ActionName)
        {
            var connections = _connectionGroupsManager.GetConnections(_groupId);
            await _context.Clients.Clients(connections).SendAsync(ActionName, message);
        }
    }
}
