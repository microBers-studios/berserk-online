using berserk_online_server.Data_objects.Cards;

namespace berserk_online_server.Data_objects.Gameplay
{
    public class GameplayInfo
    {
        public List<List<FieldCell?>> Field { get; set; }
        public PlayerGameplayInfo[] PlayersInfo { get; set; }
    }
}
