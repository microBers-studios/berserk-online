using berserk_online_server.Controllers.Hubs;
using berserk_online_server.Implementations.Gameplay.Dispatchers;
using berserk_online_server.Interfaces.Dispatchers;
using berserk_online_server.Interfaces.Fabrics;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Utils
{
    public class GroupDispatcherFabric : IGroupDispatcherFabric
    {
        private readonly IHubContext<RoomHub> _hubContext;
        private readonly IConnectionGroupsManager _connectionGroupsManager;
        public GroupDispatcherFabric(IHubContext<RoomHub> hubContext, IConnectionGroupsManager connectionGroupsManager)
        {
            _hubContext = hubContext;
            _connectionGroupsManager = connectionGroupsManager;
        }

        public string GroupId { get; set; }

        public IGroupDispatcher<T> Create<T>(string groupId)
        {
            return new GameplayUpdateDispatcher<T>(_hubContext, _connectionGroupsManager);
        }

        public IGroupDispatcher<T> Create<T>()
        {
            return new GameplayUpdateDispatcher<T>(_hubContext, _connectionGroupsManager);
        }
    }
}
