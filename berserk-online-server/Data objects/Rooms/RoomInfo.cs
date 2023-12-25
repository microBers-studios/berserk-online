using berserk_online_server.Data_objects.Gameplay;

namespace berserk_online_server.Data_objects.Rooms
{
    public class RoomInfo : RoomOverview
    {
        public ChatMessage[] ChatMessages { get; set; }
        public RoomEvent[] Logs { get; set; }
        public GameplayInfo? GameplayInfo { get; set; }
    }
}
