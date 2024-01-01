
namespace berserk_online_server.Data_objects.Gameplay.Requests
{
    public class CardMoveRequest
    {
        public BerserkCardMoveTarget From { get; set; }
        public BerserkCardMoveTarget To { get; set; }
        public string CardId { get; set; }
    }
}
