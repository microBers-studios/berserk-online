using berserk_online_server.DTO;

namespace berserk_online_server.Data_objects.Rooms
{
    public class ChatMessage
    {
        public UserInfo Sender { get; set; }
        public string Content { get; set; }
        public string Id { get; set; }
    }
}
