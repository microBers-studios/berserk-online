using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Data_objects.Gameplay.Events;
using berserk_online_server.Interfaces.Gameplay;
using System.Drawing;

namespace berserk_online_server.Implementations.Gameplay.States
{
    public class BerserkFieldPreparingState : BerserkGameplayState
    {
        public BerserkFieldPreparingState(BerserkContext context) : base(context)
        {
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
        private bool isValidPoint(Point point, byte owner)
        {
            return point.X > 0 && point.X < 6 && point.Y >= (owner * 3) && point.Y < ((owner + 1) * 3);
        }
    }
}
