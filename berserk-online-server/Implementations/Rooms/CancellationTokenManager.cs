using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Implementations.Rooms
{
    public class CancellationTokenManager<T> : ICancellationTokenManager<T> where T : notnull
    {
        private readonly Dictionary<T, CancellationTokenSource> _map = new();
        public void AddToken(T key, CancellationTokenSource tokenSource)
        {
            _map[key] = tokenSource;
        }
        public void TryCancel(T key)
        {
            if (_map.ContainsKey(key))
            {
                _map[key].Cancel();
                _map.Remove(key);
            }
        }
    }
}
