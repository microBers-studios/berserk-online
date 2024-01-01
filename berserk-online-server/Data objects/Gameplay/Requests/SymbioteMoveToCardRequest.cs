namespace berserk_online_server.Data_objects.Gameplay.Requests
{
    public class SymbioteMoveToCardRequest
    {
        public string SymbioteId { get; set; }
        public BerserkCardMoveTarget From { get; set; }
        public string TargetId { get; set; }
    }
}
