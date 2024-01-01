using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Data_objects.Gameplay;
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
        public virtual void EditChip(Point point, Chip chip, int id)
        {
            throwInvalidOperation();
        }
        public virtual void FlipCard(Point point)
        {
            throwInvalidOperation();
        }
        public virtual void RemoveChip(Point point, Chip chip)
        {
            throwInvalidOperation();
        }
        public virtual void SetDeck(string deckId, sbyte owner)
        {
            throwInvalidOperation();
        }
        public virtual void TapCard(Point point)
        {
            throwInvalidOperation();
        }
        public virtual void MoveCard(BerserkCardMoveTarget from, BerserkCardMoveTarget to, string cardId)
        {
            throwInvalidOperation();
        }
        public virtual void MoveCardToField(BerserkCardMoveTarget from, Point point, string cardId)
        {
            throwInvalidOperation();
        }
        public virtual void MoveSymbioteToCard(BerserkCardMoveTarget from, string symbioteId, string targetId)
        {
            throwInvalidOperation();
        }
        public virtual void MoveSymbioteFromCard(BerserkCardMoveTarget to, string symbioteId)
        {
            throwInvalidOperation();
        }
        public virtual void StartGame()
        {
            throwInvalidOperation();
        }
        public virtual void Reroll(sbyte owner)
        {
            throwInvalidOperation();
        }
        public virtual void SetHand(string[] cardIds, sbyte owner)
        {
            throwInvalidOperation();
        }
        public virtual PlayableCard[] GetExile(sbyte targetOwner, sbyte owner)
        {
            throw new InvalidOperationException();
        }
        public virtual PlayableCard[] GetGraveyard(sbyte targetOwner, sbyte owner)
        {
            throw new InvalidOperationException();
        }
        public virtual PlayableCard[] GetDeck(sbyte targetOwner, sbyte owner)
        {
            throw new InvalidOperationException();
        }
        public virtual PlayableCard[] GetFlying(sbyte targetOwner, sbyte owner)
        {
            throw new InvalidOperationException();
        }
        protected void throwInvalidOperation()
        {
            throw new InvalidOperationException("Operation invalid due to the current state");
        }
    }
}
