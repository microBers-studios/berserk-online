using berserk_online_server.Data_objects.Cards;
using System.Drawing;

namespace berserk_online_server.Data_objects.Gameplay.Events
{
    public class CardEvent
    {
        public string Type { get; set; }
        public Point Point { get; set; }
        public PlayableCard Card { get; set; }
    }
}
