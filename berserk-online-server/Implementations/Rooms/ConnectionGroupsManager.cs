using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Implementations.Rooms
{
    public class ConnectionGroupsManager : IConnectionGroupsManager
    {
        private Dictionary<string, List<string>> _groups = new();

        public string[] ConnectionIds => _groups.Values.SelectMany(id => id).ToArray();

        public void Add(string connectionId, string roomId)
        {
            if (_groups.ContainsKey(roomId))
            {
                _groups[roomId].Add(connectionId);
            }
            else
            {
                _groups[roomId] = new List<string>(new[] { connectionId });
            }
        }

        public string[] GetConnections(string roomId)
        {

            if (!_groups.ContainsKey(roomId))
                return Array.Empty<string>();
            return _groups[roomId].ToArray();
        }

        public void RemoveConnection(string connectionId)
        {
            foreach (var list in _groups.Values)
            {
                list.Remove(connectionId);
            }
        }

        public void RemoveRoom(string roomId)
        {
            _groups.Remove(roomId);
        }
    }
}
