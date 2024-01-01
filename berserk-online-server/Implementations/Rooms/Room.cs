using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.DTO;
using berserk_online_server.Interfaces.Gameplay;
using berserk_online_server.Interfaces.Rooms;
using System.Collections.Immutable;
using System.Text.Json.Serialization;

namespace berserk_online_server.Implementations.Rooms
{
    public class Room : IRoom
    {
        private readonly PlayerSlot[] _players = new PlayerSlot[2] { new PlayerSlot(), new PlayerSlot() };
        private readonly Dictionary<string, UserInfo> _spectators = new();
        private readonly IChat _chat = new Chat();
        private readonly List<RoomEvent> _eventLogs = new();

        public event Action<RoomEvent> OnChanges;

        public ImmutableArray<PlayerSlot> Players => _players.ToImmutableArray();

        public List<UserInfo> Spectators => _spectators.Select(pair => pair.Value)
            .ToList();

        public string Name { get; set; }
        public string Id { get; set; }
        public ChatMessage[] ChatMessages => _chat.GetMessages();
        public IChat Chat => _chat;

        public List<RoomEvent> Logs => _eventLogs.ToList();
        [JsonIgnore]
        public IGameplayContext GameplayContext { get; set; }

        public RoomType Type { get; private set; }

        public Room(RoomType type)
        {
            Type = type;
            OnChanges += _eventLogs.Add;
        }
        public Room(string name, string id, RoomType type) : this(type)
        {
            Name = name;
            Id = id;
        }
        public Room(string name, RoomType type) : this(type)
        {
            Name = name;
            Id = Guid.NewGuid().ToString();
        }
        public void AddPlayer(UserInfo player)
        {
            addPlayer(player);
            OnChanges?.Invoke(new RoomEvent()
            {
                Type = RoomEventTypes.PLAYER_JOINED,
                Initiator = player,
            });
        }

        public void AddSpectator(UserInfo spectator)
        {
            addSpectator(spectator);
            OnChanges?.Invoke(new RoomEvent()
            {
                Type = RoomEventTypes.SPECTATOR_JOINED,
                Initiator = spectator,
            });
        }

        public void RemovePlayer(UserInfo player)
        {
            if (removeFromPlayers(player))
            {
                OnChanges?.Invoke(new RoomEvent()
                {
                    Type = RoomEventTypes.PLAYER_LEAVED,
                    Initiator = player,
                });
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
            if (_spectators.Values.Any(p => p.Id == player.Id))
                return;
            removeFromPlayers(player);
            addSpectator(player);
            OnChanges?.Invoke(new RoomEvent()
            {
                Type = RoomEventTypes.TO_SPECTATOR,
                Initiator = player,
            });
        }

        public void MoveToPlayers(UserInfo spectator)
        {
            if (_players.Any(p => p.User != null && p.User.Id == spectator.Id))
                return;
            _spectators.Remove(spectator.Email);
            addPlayer(spectator);
            OnChanges?.Invoke(new RoomEvent()
            {
                Type = RoomEventTypes.TO_PLAYER,
                Initiator = spectator,
            });
        }
        private bool removeFromPlayers(UserInfo player)
        {
            for (int i = 0; i < 2; i++)
            {
                if (_players[i].User != null && _players[i].User.Email == player.Email)
                {
                    _players[i] = new PlayerSlot();
                    return true;
                }
            }
            return false;
        }
        public void ToggleReady(UserInfo player)
        {
            var slot = Players.Where(p => p.User?.Id == player.Id).FirstOrDefault();
            if (slot != null)
            {
                slot.IsReady = !slot.IsReady;
                OnChanges?.Invoke(new RoomEvent()
                {
                    Type = slot.IsReady ? RoomEventTypes.PLAYER_READY : RoomEventTypes.PLAYER_NOT_READY,
                    Initiator = slot.User!,
                });
                checkGameStart();
            }
        }
        private void checkGameStart()
        {
            if (Players.All(p => p.IsReady))
            {
                GameplayContext.StartGame();
            }
        }
        private void addPlayer(UserInfo player)
        {
            if (_players[0].User == null)
                _players[0] = new PlayerSlot(player);
            else if (_players[1].User == null)
                _players[1] = new PlayerSlot(player);
            else
                throw new InvalidOperationException("room is full, but try to add player.");
        }
        private void addSpectator(UserInfo spectator)
        {
            if (!_spectators.TryAdd(spectator.Email, spectator))
                throw new InvalidOperationException("this spectator already exists");
        }
    }
}
