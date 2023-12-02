namespace berserk_online_server.Interfaces.Rooms
{
    public interface IDispatcher<T>
    {
        Task Dispatch(T info);
    }
}
