using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Interfaces.Dispatchers
{
    public interface IRoomListDispatcher : IDispatcher<RoomsListEvent>
    {
        Task DispatchList(IEnumerable<IRoom> rooms);
    }
}
