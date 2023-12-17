using berserk_online_server.Controllers.Hubs;
using berserk_online_server.Interfaces.Dispatchers;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Implementations.Gameplay.Dispatchers
{
    public class GroupInvoker : IGroupInvoker
    {
        private readonly IHubContext<RoomHub> _context;
        private readonly IConnectionGroupsManager _connectionGroupsManager;
        public GroupInvoker(IHubContext<RoomHub> context, IConnectionGroupsManager connectionGroupsManager)
        {
            _context = context;
            _connectionGroupsManager = connectionGroupsManager;
        }

        public string GroupId { get; set; }

        public async Task InvokeClientAsync(string actionName)
        {
            var connections = _connectionGroupsManager.GetConnections(GroupId);
            await _context.Clients.Clients(connections).SendAsync(actionName);
        }
    }
}
