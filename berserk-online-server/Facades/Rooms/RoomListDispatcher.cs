using berserk_online_server.Constants;
using berserk_online_server.Controllers.Hubs;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Facades.Rooms
{
    public class RoomListDispatcher : IDispatcher<RoomListEvent>
    {
        private readonly IHubContext<RoomListHub> _hubContext;
        public RoomListDispatcher(IHubContext<RoomListHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public async Task Dispatch(RoomListEvent info)
        {
            await _hubContext.Clients.All.SendAsync(RoomHubMethodNames.ROOM_LIST_UPDATE, info);
        }
    }
}
