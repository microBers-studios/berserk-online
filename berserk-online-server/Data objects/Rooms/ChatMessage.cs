using berserk_online_server.DTO;

namespace berserk_online_server.Data_objects.Rooms
{
    public class ChatMessage
    {
        public ChatMessage()
        {
            TimeStamp = DateTime.Now.ToLongTimeString();
        }
        public UserInfo Sender { get; set; }
        public string Content { get; set; }
        public string Id { get; set; }
        public string TimeStamp { get; set; }
    }
}
