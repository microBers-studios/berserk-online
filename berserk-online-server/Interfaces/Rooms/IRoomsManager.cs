using berserk_online_server.Models.Db;

namespace berserk_online_server.Interfaces.Rooms
{
    public interface IRoomsManager
    {
        IRoom Create(string name, UserInfo creator);
        IRoom Get(string id);
        IRoom[] GetAll();
        void Join(UserInfo user, string roomId);
        void Leave(UserInfo user, string roomId);
        void ToSpectator(UserInfo user);
        void ToPlayer(UserInfo user);
    }
}
