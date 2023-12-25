using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.DTO;
using berserk_online_server.Interfaces.Gameplay;
using System.Collections.Immutable;

namespace berserk_online_server.Interfaces.Rooms
{
    public interface IRoom
    {
        event Action<RoomEvent> OnChanges;
        ImmutableArray<PlayerSlot> Players { get; }
        List<UserInfo> Spectators { get; }
        IChat Chat { get; }
        List<RoomEvent> Logs { get; }
        IGameplayContext GameplayContext { get; set; }
        string Name { get; set; }
        string Id { get; set; }
        public RoomType Type { get; }
        void MoveToSpectators(UserInfo player);
        void MoveToPlayers(UserInfo spectator);
        void AddPlayer(UserInfo player);
        void RemovePlayer(UserInfo player);
        void AddSpectator(UserInfo spectator);
        void RemoveSpectator(UserInfo spectator);
        void ToggleReady(UserInfo player);
    }
}
