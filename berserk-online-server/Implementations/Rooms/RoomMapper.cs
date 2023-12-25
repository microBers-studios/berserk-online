using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.Data_objects.Rooms;
using berserk_online_server.Implementations.Gameplay;
using berserk_online_server.Implementations.Gameplay.States;
using berserk_online_server.Interfaces.Rooms;

namespace berserk_online_server.Implementations.Rooms
{
    public static class RoomMapper
    {
        public static RoomInfo ToInfo(IRoom room)
        {
            return new RoomInfo()
            {
                Id = room.Id,
                Name = room.Name,
                Players = room.Players.ToArray(),
                Spectators = room.Spectators.ToArray(),
                ChatMessages = room.Chat.GetMessages(),
                Logs = room.Logs.ToArray(),
                GameplayInfo = getContext(room)
            };
        }
        public static RoomOverview ToOverview(IRoom room)
        {
            return new RoomOverview()
            {
                Id = room.Id,
                Name = room.Name,
                Players = room.Players.ToArray(),
                Spectators = room.Spectators.ToArray()
            };
        }
        private static GameplayInfo? getContext(IRoom room)
        {
            switch (room.Type)
            {
                case RoomType.ClassicBerserk:
                    return mapClassicalBerserkContext(room.GameplayContext as BerserkContext);
            }
            throw new NotImplementedException();
        }
        private static GameplayInfo? mapClassicalBerserkContext(BerserkContext ctx)
        {
            if (ctx.State is BerserkGameNotStartedState) return null;
            return new GameplayInfo()
            {
                Field = ctx.Field.GetAll(),
                PlayersInfo = ctx.SideContexts.Select(x => new PlayerGameplayInfo()
                {
                    Deck = x.Deck,
                    Exile = x.Exile,
                    Flying = x.Flying,
                    Graveyard = x.Graveyard,
                    Owner = x.Owner,
                }).ToArray()
            };
        }
    }
}
