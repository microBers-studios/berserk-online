namespace berserk_online_server.Interfaces.Dispatchers
{
    public interface IGroupDispatcher<T>
    {
        Task DispatchAsync(T message, string ActionName, string groupId);
    }
}
