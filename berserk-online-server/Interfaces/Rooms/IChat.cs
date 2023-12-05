using berserk_online_server.Data_objects.Rooms;

namespace berserk_online_server.Interfaces.Rooms
{
    public interface IChat
    {
        void AddMessage(ChatMessage message);
        ChatMessage[] GetMessages();
    }
}
