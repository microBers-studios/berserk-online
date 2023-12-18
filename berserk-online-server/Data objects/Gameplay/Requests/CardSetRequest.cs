using berserk_online_server.Data_objects.Cards;
using System.Drawing;

namespace berserk_online_server.Data_objects.Gameplay.Requests
{
    public class CardSetRequest
    {
        public Point Point { get; set; }
        public PlayableCard Card { get; set; }
    }
}
