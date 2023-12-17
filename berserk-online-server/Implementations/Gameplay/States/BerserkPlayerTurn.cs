using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.DTO.Cards;
using berserk_online_server.Interfaces.Gameplay;
using System.Drawing;

namespace berserk_online_server.Implementations.Gameplay.States
{
    public class BerserkPlayerTurn : BerserkGameplayState
    {
        private readonly byte _owner;
        public BerserkPlayerTurn(BerserkContext context, byte owner) : base(context)
        {
            _owner = owner;
        }

        public override void AddChip(Point point, Chip chip)
        {
            throw new NotImplementedException();
        }

        public override void AddChipToCard(Point point, ChipType type)
        {
            throw new NotImplementedException();
        }

        public override void AddExileCard(PlayableCard card, byte owner)
        {
            throw new NotImplementedException();
        }

        public override void AddGraveyardCard(byte owner, PlayableCard card)
        {
            throw new NotImplementedException();
        }

        public override void AddSymbioteToCard(Point point, PlayableCard card)
        {
            throw new NotImplementedException();
        }

        public override void EditChip(Point point, Chip chip, int id)
        {
            throw new NotImplementedException();
        }

        public override void FlipCard(Point point)
        {
            throw new NotImplementedException();
        }

        public override void MoveFieldCard(Point oldPoint, Point newPoint, byte owner)
        {
            throw new NotImplementedException();
        }

        public override void RemoveChip(Point point, Chip chip)
        {
            throw new NotImplementedException();
        }

        public override void RemoveExileCard(PlayableCard card, byte owner)
        {
            throw new NotImplementedException();
        }

        public override void RemoveFieldCard(Point point, byte owner)
        {
            throw new NotImplementedException();
        }

        public override void RemoveGraveyardCard(byte owner, PlayableCard card)
        {
            throw new NotImplementedException();
        }

        public override void RemoveSymbioteFromCard(Point point, PlayableCard card)
        {
            throw new NotImplementedException();
        }

        public override void SetDeck(Deck deck, byte owner)
        {
            throw new NotImplementedException();
        }

        public override void SetFieldCard(Point point, PlayableCard card, byte owner)
        {
            throw new NotImplementedException();
        }

        public override void TapCard(Point point)
        {
            throw new NotImplementedException();
        }
    }
}
