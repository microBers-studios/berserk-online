using berserk_online_server.Constants;
using berserk_online_server.Controllers.Hubs;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Implementations.Rooms
{
    public class RoomListDispatcher : IRoomListDispatcher
    {
        private readonly IHubContext<RoomsListHub> _hubContext;
        public RoomListDispatcher(IHubContext<RoomsListHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public async Task Dispatch(RoomsListEvent info)
        {
            await _hubContext.Clients.All.SendAsync(RoomHubMethodNames.ROOMS_LIST_UPDATE, info);
        }

        public async Task DispatchList(IEnumerable<IRoom> rooms)
        {
            await _hubContext.Clients.All.SendAsync(RoomHubMethodNames.ROOMS_LIST, rooms
                .Select(RoomMapper.ToOverview)
                .ToArray());
        }
    }
}
