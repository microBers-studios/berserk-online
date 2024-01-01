using System.Drawing;

namespace berserk_online_server.Data_objects.Gameplay.Requests
{
    public class CardMoveToFieldRequest
    {
        public BerserkCardMoveTarget From { get; set; }
        public string CardId { get; set; }
        public Point Point { get; set; }
    }
}
