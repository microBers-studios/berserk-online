using berserk_online_server.DTO;
using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Implementations.Rooms
{
    public class UserLocationManager : IUserLocationManager
    {
        //userEmail
        private Dictionary<string, IRoom> _userLocations = new();
        public void ChangeLocation(UserInfo user, IRoom room)
        {
            removeFromOldRoom(user);
            writeNewLocation(user, room);
        }

        public IRoom GetLocation(UserInfo user)
        {
            return _userLocations[user.Email] ?? throw new KeyNotFoundException();
        }

        public void RemoveLocation(UserInfo user)
        {
            removeFromOldRoom(user);
            _userLocations.Remove(user.Email);
        }
        private void removeFromOldRoom(UserInfo user)
        {
            if (_userLocations.TryGetValue(user.Email, out IRoom? room))
            {
                room.RemovePlayer(user);
                room.RemoveSpectator(user);
                _userLocations.Remove(user.Email);
            }
        }
        private void writeNewLocation(UserInfo user, IRoom room)
        {
            _userLocations[user.Email] = room;
        }
    }
}
