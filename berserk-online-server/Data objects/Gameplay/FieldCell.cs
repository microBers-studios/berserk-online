using berserk_online_server.Data_objects.Cards;

namespace berserk_online_server.Data_objects.Gameplay
{
    public class FieldCell
    {
        public PlayableCard? Card { get; set; }
        public List<Chip> Chips { get; } = new List<Chip>();
    }
}
