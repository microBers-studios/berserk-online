using berserk_online_server.Constants;
using berserk_online_server.Controllers.Hubs;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Facades.Rooms
{
    public class RoomUpdateDispatcher : IRoomUpdateDispatcher
    {
        private readonly IHubContext<RoomHub> _hub;
        public RoomUpdateDispatcher(IHubContext<RoomHub> hubContext)
        {
            _hub = hubContext;
        }
        public void Dispatch(RoomEvent roomEvent, string roomId)
        {
            _hub.Clients.Group(roomId).SendAsync(RoomHubMethodNames.ROOM_UPDATE, roomEvent);
        }
    }
}
