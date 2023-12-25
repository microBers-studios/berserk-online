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
        public virtual void AddChip(Point point, Chip chip)
        {
            throwInvalidOperation();
        }

        public virtual void AddChipToCard(Point point, Chip type)
        {
            throwInvalidOperation();
        }

        public virtual void AddExileCard(PlayableCard card, byte owner)
        {
            throwInvalidOperation();
        }

        public virtual void AddGraveyardCard(byte owner, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public virtual void AddSymbioteToCard(Point point, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public virtual void EditChip(Point point, Chip chip, int id)
        {
            throwInvalidOperation();
        }

        public virtual void FlipCard(Point point)
        {
            throwInvalidOperation();
        }

        public virtual void MoveFieldCard(Point oldPoint, Point newPoint, byte owner)
        {
            throwInvalidOperation();
        }

        public virtual void RemoveChip(Point point, Chip chip)
        {
            throwInvalidOperation();
        }

        public virtual void RemoveExileCard(PlayableCard card, byte owner)
        {
            throwInvalidOperation();
        }

        public virtual void RemoveFieldCard(Point point, byte owner)
        {
            throwInvalidOperation();
        }

        public virtual void RemoveGraveyardCard(byte owner, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public virtual void RemoveSymbioteFromCard(Point point, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public virtual void SetDeck(Deck deck, byte owner)
        {
            throwInvalidOperation();
        }

        public virtual void SetFieldCard(Point point, PlayableCard card, byte owner)
        {
            throwInvalidOperation();
        }

        public virtual void TapCard(Point point)
        {
            throwInvalidOperation();
        }
        public virtual void StartGame()
        {
            throwInvalidOperation();
        }
        public virtual PlayableCard[] GetExile(byte targetOwner, byte owner)
        {
            throw new InvalidOperationException();
        }
        public virtual PlayableCard[] GetGraveyard(byte targetOwner, byte owner)
        {
            throw new InvalidOperationException();
        }
        public virtual PlayableCard[] GetDeck(byte targetOwner, byte owner)
        {
            throw new InvalidOperationException();
        }
        public virtual PlayableCard[] GetFlying(byte targetOwner, byte owner)
        {
            throw new InvalidOperationException();
        }

        protected void throwInvalidOperation()
        {
            throw new InvalidOperationException("Operation invalid due to the current state");
        }
    }
}
