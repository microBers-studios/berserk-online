using berserk_online_server.Constants;
using berserk_online_server.Facades.Rooms;
using berserk_online_server.Interfaces.Rooms;
using Microsoft.AspNetCore.SignalR;

namespace berserk_online_server.Controllers.Hubs
{
    public class RoomsListHub : Hub
    {
        private readonly IRoomsManager _roomsManager;
        public RoomsListHub(IRoomsManager roomsManager)
        {
            _roomsManager = roomsManager;
        }
        public override async Task OnConnectedAsync()
        {
            if (Context.User == null || !Context.User.Claims.Any())
                Context.Abort();
            await Clients.Caller.SendAsync(RoomHubMethodNames.ROOMS_LIST, _roomsManager.GetAll()
                .Select(RoomMapper.ToOverview)
                .ToArray());
            await base.OnConnectedAsync();
        }
        public async Task Create(string name)
        {
            var room = await _roomsManager.Create(name);
            await Clients.Caller.SendAsync(RoomHubMethodNames.ROOM_INFO, RoomMapper.ToInfo(room));
        }

        public async Task GetAll()
        {
            await Clients.Caller.SendAsync(RoomHubMethodNames.ROOMS_LIST, _roomsManager.GetAll()
                .Select(RoomMapper.ToOverview)
                .ToArray());
        }
    }
}
