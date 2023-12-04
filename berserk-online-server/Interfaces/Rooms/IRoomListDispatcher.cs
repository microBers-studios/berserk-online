using berserk_online_server.Data_objects.Rooms;

namespace berserk_online_server.Interfaces.Rooms
{
    public interface IRoomListDispatcher : IDispatcher<RoomsListEvent>
    {
        Task DispatchList(IEnumerable<IRoom> rooms);
    }
}
