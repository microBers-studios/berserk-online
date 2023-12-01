using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Interfaces.Rooms;
using berserk_online_server.Models.Db;
using berserk_online_server.Utils;

namespace berserk_online_server.Facades.Rooms
{
    public class Room : IRoom
    {
        private UserInfo?[] _players = new UserInfo?[2];
        private Dictionary<string, UserInfo> _spectators = new();

        public event Action<RoomEvent> OnChanges;

        public Tuple<UserInfo?, UserInfo?> Players => new(_players[0], _players[1]);

        public List<UserInfo> Spectators => _spectators.Select(pair => pair.Value)
            .ToList();

        public string Name { get; set; }
        public string Id { get; set; }

        public Room(string name, string id)
        {
            Name = name;
            Id = id;
        }
        public Room(string name)
        {
            Name = name;
            Id = TokenGenerator.Generate();
        }
        public void AddPlayer(UserInfo player)
        {
            if (_players[0] == null)
                _players[0] = player;
            else if (_players[1] == null)
                _players[1] = player;
            else
                throw new InvalidOperationException("room is full, but try to add player.");
            OnChanges?.Invoke(new RoomEvent()
            {
                Type = RoomEventTypes.PLAYER_JOINED,
                Initiator = player,
            });
        }

        public void AddSpectator(UserInfo spectator)
        {
            if (!_spectators.TryAdd(spectator.Email, spectator))
                throw new InvalidOperationException("this spectator already exists");
            OnChanges?.Invoke(new RoomEvent()
            {
                Type = RoomEventTypes.SPECTATOR_JOINED,
                Initiator = spectator,
            });
        }

        public void RemovePlayer(UserInfo player)
        {
            for (int i = 0; i < 2; i++)
            {
                if (_players[i] != null && _players[i].Email == player.Email)
                {
                    _players[i] = null;
                    OnChanges?.Invoke(new RoomEvent()
                    {
                        Type = RoomEventTypes.PLAYER_LEAVED,
                        Initiator = player,
                    });
                    return;
                }
            }
        }

        public void RemoveSpectator(UserInfo spectator)
        {
            if (_spectators.Remove(spectator.Email))
            {
                OnChanges?.Invoke(new RoomEvent()
                {
                    Type = RoomEventTypes.SPECTATOR_LEAVED,
                    Initiator = spectator,
                });
            }
        }

        public void MoveToSpectators(UserInfo player)
        {
            RemovePlayer(player);
            RemoveSpectator(player);
            AddSpectator(player);
        }

        public void MoveToPlayers(UserInfo spectator)
        {
            RemovePlayer(spectator);
            RemoveSpectator(spectator);
            AddPlayer(spectator);
        }
    }
}
