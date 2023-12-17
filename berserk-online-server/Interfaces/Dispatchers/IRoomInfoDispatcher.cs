namespace berserk_online_server.Interfaces.Dispatchers
{
    public interface IRoomInfoDispatcher<TInfo>
    {
        public Task Dispatch(TInfo info, string groupId);
    }
}
