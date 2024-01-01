using berserk_online_server.Data_objects.Cards;
using System.Drawing;

namespace berserk_online_server.Data_objects.Gameplay.Events
{
    public class CardMovementOnFieldEvent
    {
        public PlayableCard Card { get; set; }
        public BerserkCardMoveTarget From { get; set; }
        public Point To { get; set; }
    }
}
