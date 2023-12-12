using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Facades.Rooms
{
    public static class RoomMapper
    {
        public static RoomInfo ToInfo(IRoom room)
        {
            return new RoomInfo()
            {
                Id = room.Id,
                Name = room.Name,
                Players = room.Players.ToArray(),
                Spectators = room.Spectators.ToArray(),
                ChatMessages = room.Chat.GetMessages(),
                Logs = room.Logs.ToArray()
            };
        }
        public static RoomOverview ToOverview(IRoom room)
        {
            return new RoomOverview()
            {
                Id = room.Id,
                Name = room.Name,
                Players = room.Players.ToArray(),
                Spectators = room.Spectators.ToArray()
            };
        }
    }
}
