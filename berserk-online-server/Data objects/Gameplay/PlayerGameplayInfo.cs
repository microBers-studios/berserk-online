using berserk_online_server.Data_objects.Cards;

namespace berserk_online_server.Data_objects.Gameplay
{
    public class PlayerGameplayInfo
    {
        public byte Owner { get; set; }
        public List<PlayableCard> Deck { get; set; }
        public List<PlayableCard> Exile { get; set; }
        public List<PlayableCard> Flying { get; set; }
        public List<PlayableCard> Graveyard { get; set; }
    }
}
