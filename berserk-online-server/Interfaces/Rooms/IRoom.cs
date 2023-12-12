using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.DTO;
using System.Collections.Immutable;
using System.Text.Json.Serialization;

namespace berserk_online_server.Interfaces.Rooms
{
    public interface IRoom
    {
        event Action<RoomEvent> OnChanges;
        ImmutableArray<UserInfo?> Players { get; }
        List<UserInfo> Spectators { get; }
        IChat Chat { get; }
        List<RoomEvent> Logs { get; }
        string Name { get; set; }
        string Id { get; set; }
        void MoveToSpectators(UserInfo player);
        void MoveToPlayers(UserInfo spectator);
        void AddPlayer(UserInfo player);
        void RemovePlayer(UserInfo player);
        void AddSpectator(UserInfo spectator);
        void RemoveSpectator(UserInfo spectator);
    }
}
