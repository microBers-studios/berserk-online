using berserk_online_server.Data_objects.Gameplay;

namespace berserk_online_server.Data_objects.Cards
{
    public class PlayableCard
    {
        private List<PlayableCard> _symbiotes = new List<PlayableCard>();
        public string Uid { get; } = Guid.NewGuid().ToString();
        public int CardId { get; private set; }
        public CardType CardType { get; private set; }
        public string Image { get; set; }
        public List<Chip> Chips { get; } = new List<Chip>();
        public byte Owner { get; set; }
        public bool Flipped { get; set; } = false;
        public bool Tapped { get; set; } = false;
        public PlayableCard(byte owner, int id, CardType type, string image)
        {
            CardId = id;
            Owner = owner;
            Image = image;
            CardType = type;
        }
        public void AddSymbiote(PlayableCard card)
        {
            if (card.CardType != CardType.Symbiote)
                throw new InvalidOperationException("card is not symbiote.");
            _symbiotes.Add(card);
        }
        public void RemoveSymbiote(PlayableCard card)
        {
            _symbiotes.Remove(card);
        }
    }
}
