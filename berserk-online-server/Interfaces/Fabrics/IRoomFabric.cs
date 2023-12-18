using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Interfaces.Fabrics
{
    public interface IRoomFabric
    {
        IRoom Create(string name, string id);
    }
}
