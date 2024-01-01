namespace berserk_online_server.Data_objects.Gameplay.Requests
{
    public class SymbioteMoveFromCardRequest
    {
        public BerserkCardMoveTarget To { get; set; }
        public string SymbioteId { get; set; }
    }
}
