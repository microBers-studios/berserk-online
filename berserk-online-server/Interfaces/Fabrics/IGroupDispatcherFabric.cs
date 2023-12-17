using berserk_online_server.Interfaces.Dispatchers;

namespace berserk_online_server.Interfaces.Fabrics
{
    public interface IGroupDispatcherFabric
    {
        string GroupId { get; set; }
        IGroupDispatcher<T> Create<T>(string groupId);
        IGroupDispatcher<T> Create<T>();
    }
}
