using berserk_online_server.DTO;

namespace berserk_online_server.Interfaces.Rooms
{
    public interface IRoomsManager
    {
        Task<IRoom> Create(string name, UserInfo creator);
        IRoom Get(string id);
        IRoom[] GetAll();
        void Join(UserInfo user, string roomId);
        Task Leave(UserInfo user);
        void ToSpectator(UserInfo user);
        void ToPlayer(UserInfo user);
    }
}
