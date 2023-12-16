using berserk_online_server.Data_objects.Cards;

namespace berserk_online_server.Data_objects.Gameplay.Events
{
    public class AdditionalCellsEvent
    {
        public string Type { get; set; }
        public PlayableCard Card { get; set; }
    }
}
