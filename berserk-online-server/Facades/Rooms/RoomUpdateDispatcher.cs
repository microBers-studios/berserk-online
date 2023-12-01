using berserk_online_server.Constants;
using berserk_online_server.Controllers.Hubs;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Facades.Rooms
{
    public class RoomUpdateDispatcher : IGroupDispatcher<RoomEvent>
    {
        private readonly IHubContext<RoomHub> _hub;
        private readonly IConnectionGroupsManager _connectionManager;
        public RoomUpdateDispatcher(IHubContext<RoomHub> hubContext, IConnectionGroupsManager connectionManager)
        {
            _hub = hubContext;
            _connectionManager = connectionManager;
        }
        public async Task Dispatch(RoomEvent roomEvent, string roomId)
        {
            var clients = _connectionManager.GetConnections(roomId);
            await _hub.Clients.Clients(clients).SendAsync(RoomHubMethodNames.ROOM_UPDATE, roomEvent);
        }
    }
}
