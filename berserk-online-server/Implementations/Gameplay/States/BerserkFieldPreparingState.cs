using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.Data_objects.Gameplay.Events;
using berserk_online_server.DTO.Cards;
using berserk_online_server.Interfaces.Gameplay;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System.Drawing;

namespace berserk_online_server.Implementations.Gameplay.States
{
    public class BerserkFieldPreparingState : BerserkGameplayState
    {
        public BerserkFieldPreparingState(BerserkContext context) : base(context)
        {
        }

        public override void AddChip(Point point, Chip chip)
        {
            throwInvalidOperation();
        }

        public override void AddChipToCard(Point point, ChipType type)
        {
            throwInvalidOperation();
        }

        public override void AddExileCard(PlayableCard card, byte owner)
        {
            throwInvalidOperation();
        }

        public override void AddGraveyardCard(byte owner, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public override void AddSymbioteToCard(Point point, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public override void EditChip(Point point, Chip chip, int id)
        {
            throwInvalidOperation();
        }

        public override void FlipCard(Point point)
        {
            throwInvalidOperation();
        }

        public override void MoveFieldCard(Point oldPoint, Point newPoint, byte owner)
        {
            throwInvalidOperation();
        }

        public override void RemoveChip(Point point, Chip chip)
        {
            throwInvalidOperation();
        }

        public override void RemoveExileCard(PlayableCard card, byte owner)
        {
            throwInvalidOperation();
        }

        public override void RemoveFieldCard(Point point, byte owner)
        {
            if (isValidPoint(point, owner))
            {
                Context.Field.ClearCell(point);
                Context.InvokeEvent(new CardEvent()
                {
                    Point = point,
                    Card = null,
                    Type = CardEventTypes.REMOVE_CARD
                });
            }
            else throwInvalidOperation();
        }

        public override void RemoveGraveyardCard(byte owner, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public override void RemoveSymbioteFromCard(Point point, PlayableCard card)
        {
            throwInvalidOperation();
        }

        public override void SetDeck(Deck deck, byte owner)
        {
            throwInvalidOperation();
        }

        public override void SetFieldCard(Point point, PlayableCard card, byte owner)
        {
            if (isValidPoint(point, owner))
            {
                Context.Field.SetCell(card, point);
                Context.InvokeEvent(new CardEvent()
                {
                    Card = card,
                    Point = point,
                    Type = CardEventTypes.CARD_APPEAR
                });
            }
            else throwInvalidOperation();
        }

        public override void TapCard(Point point)
        {
            throwInvalidOperation();
        }
        private bool isValidPoint(Point point, byte owner)
        {
            return point.X > 0 && point.X < 6 && point.Y >= (owner * 3) && point.Y < ((owner + 1) * 3);
        }
    }
}
