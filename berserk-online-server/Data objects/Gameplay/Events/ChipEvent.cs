using berserk_online_server.Data_objects.Cards;

namespace berserk_online_server.Data_objects.Gameplay.Events
{
    public sealed class ChipEvent
    {
        public string Type { get; set; }
        public Chip Chip { get; set; }
        public PlayableCard Card { get; set; }
    }
}
