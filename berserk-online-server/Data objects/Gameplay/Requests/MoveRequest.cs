using System.Drawing;

namespace berserk_online_server.Data_objects.Gameplay.Requests
{
    public class MoveRequest
    {
        public Point OldPoint { get; set; }
        public Point NewPoint { get; set; }
    }
}
