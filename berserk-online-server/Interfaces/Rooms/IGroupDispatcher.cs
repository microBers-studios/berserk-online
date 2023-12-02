namespace berserk_online_server.Interfaces.Rooms
{
    public interface IGroupDispatcher<T>
    {
        public Task Dispatch(T info, string groupId);
    }
}
