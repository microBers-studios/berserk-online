using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.DTO.Cards;
using berserk_online_server.Implementations.Gameplay;
using System.Drawing;

namespace berserk_online_server.Interfaces.Gameplay
{
    public abstract class BerserkGameplayState
    {
        public BerserkContext Context { get; private set; }
        public BerserkGameplayState(BerserkContext context)
        {
            Context = context;
        }
        public abstract void SetDeck(Deck deck, byte owner);
        public abstract void MoveFieldCard(Point oldPoint, Point newPoint, byte owner);
        public abstract void RemoveFieldCard(Point point, byte owner);
        public abstract void SetFieldCard(Point point, PlayableCard card, byte owner);
        public abstract void AddGraveyardCard(byte owner, PlayableCard card);
        public abstract void RemoveGraveyardCard(byte owner, PlayableCard card);
        public abstract void AddExileCard(PlayableCard card, byte owner);
        public abstract void RemoveExileCard(PlayableCard card, byte owner);
        public abstract void AddChipToCard(Point point, ChipType type);
        public abstract void AddSymbioteToCard(Point point, PlayableCard card);
        public abstract void RemoveSymbioteFromCard(Point point, PlayableCard card);
        public abstract void AddChip(Point point, Chip chip);
        public abstract void RemoveChip(Point point, Chip chip);
        public abstract void EditChip(Point point, Chip chip, int id);
        public abstract void FlipCard(Point point);
        public abstract void TapCard(Point point);

        protected void throwInvalidOperation()
        {
            throw new InvalidOperationException("Operation invalid due to the current state");
        }
    }
}
