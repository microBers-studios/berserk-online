using berserk_online_server.Constants;
using berserk_online_server.Controllers.Hubs;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Facades.Rooms
{
    public class RoomListDispatcher : IDispatcher<RoomListEvent>
    {
        private readonly IHubContext<RoomHub> _hubContext;
        private readonly IConnectionGroupsManager _connectionManager;
        public RoomListDispatcher(IHubContext<RoomHub> hubContext, IConnectionGroupsManager connectionManager)
        {
            _hubContext = hubContext;
            _connectionManager = connectionManager;
        }
        public async Task Dispatch(RoomListEvent info)
        {
            var idsInGroups = _connectionManager.ConnectionIds;
            var connectionIds = _hubContext.Clients.AllExcept(idsInGroups);
            await connectionIds.SendAsync(RoomHubMethodNames.ROOM_LIST_UPDATE, info);
        }
    }
}
