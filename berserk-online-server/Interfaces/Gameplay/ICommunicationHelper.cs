using berserk_online_server.DTO;

namespace berserk_online_server.Interfaces.Gameplay
{
    public interface ICommunicationHelper
    {
        string RoomId { get; set; }
        void SendMessageGroup<T>(string actionName, T message);
        void SendMessageAllPlayers<T>(string actionName, T message);
        void SendMessagePlayer<T>(string actionName, T message, sbyte owner);
        void SendActionAllPlayers(string actionName);
        void SendActionGroup(string actionName);
        void SendActionPlayer(string actionName, sbyte owner);
    }
}
