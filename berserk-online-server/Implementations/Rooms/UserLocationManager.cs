using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.DTO;
using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Implementations.Rooms
{
    public class UserLocationManager : IUserLocationManager
    {
        //userEmail
        private Dictionary<string, UserLocation> _userLocations = new();
        public void ChangeLocation(UserInfo user, IRoom room, string connectionId)
        {
            removeFromOldRoom(user);
            writeNewLocation(user, room, connectionId);
        }

        public string GetConnection(UserInfo user)
        {
            return _userLocations[user.Email].ConnectionId ?? throw new KeyNotFoundException();
        }

        public IRoom GetLocation(UserInfo user)
        {
            return _userLocations[user.Email].Room ?? throw new KeyNotFoundException();
        }

        public void RemoveLocation(UserInfo user)
        {
            removeFromOldRoom(user);
            _userLocations.Remove(user.Email);
        }
        private void removeFromOldRoom(UserInfo user)
        {
            if (_userLocations.TryGetValue(user.Email, out UserLocation? location))
            {
                location.Room.RemovePlayer(user);
                location.Room.RemoveSpectator(user);
                _userLocations.Remove(user.Email);
            }
        }
        private void writeNewLocation(UserInfo user, IRoom room, string connectionId)
        {
            _userLocations[user.Email] = new UserLocation()
            {
                Room = room,
                ConnectionId = connectionId
            };
        }
    }
}
