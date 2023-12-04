namespace berserk_online_server.Interfaces.Rooms
{
    public interface ICancellationTokenManager<T> where T : notnull
    {
        void TryCancel(T key);
        void AddToken(T key, CancellationTokenSource tokenSource);
    }
}
