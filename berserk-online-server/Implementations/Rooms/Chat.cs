using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Implementations.Rooms
{
    public class Chat : IChat
    {
        private readonly List<ChatMessage> _messages = new();
        public void AddMessage(ChatMessage message)
        {
            _messages.Add(message);
        }

        public ChatMessage[] GetMessages()
        {
            return _messages.ToArray();
        }
    }
}
