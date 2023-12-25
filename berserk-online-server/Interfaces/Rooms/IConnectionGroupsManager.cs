
namespace berserk_online_server.Interfaces.Rooms
{
    public interface IConnectionGroupsManager
    {
        string[] ConnectionIds { get; }
        void Add(string connectionId, string roomId);
        void RemoveConnection(string connectionId);
        void RemoveRoom(string roomId);
        string[] GetConnections(string roomId);
        KeyValuePair<int, string>[] GetWithUserId(string roomId);
    }
}
