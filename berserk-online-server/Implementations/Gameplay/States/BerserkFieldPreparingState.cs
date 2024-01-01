using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.Data_objects.Gameplay.Events;
using berserk_online_server.Interfaces.Gameplay;
using System.Drawing;

namespace berserk_online_server.Implementations.Gameplay.States
{
    public class BerserkFieldPreparingState : BerserkGameplayState
    {
        public BerserkFieldPreparingState(BerserkContext context) : base(context)
        {
            sendHandsToPlayer(0);
            sendHandsToPlayer(1);
        }
        public override void MoveCardToField(BerserkCardMoveTarget from, Point point, string cardId)
        {
            switch (from)
            {
                case BerserkCardMoveTarget.Hand:
                    for (int i = 0; i < 2; i++)
                    {
                        PlayableCard card;
                        if ((card = Context.SideContexts[i].Hand.Find(c => c.Uid == cardId)) != null)
                        {
                            Context.SideContexts[i].Hand.Remove(card);
                            card.Flipped = true;
                            Context.Field.SetCell(card, point);
                            Context.EventCommunicator.SendFieldMoveEvent(new CardMovementOnFieldEvent()
                            {
                                Card = card,
                                From = from,
                                To = point
                            });
                        }
                    }
                    return;
                case BerserkCardMoveTarget.Field:
                    {
                        var card = Context.Field.Find(cardId);
                        Context.Field.ClearCell(cardId);
                        card.Flipped = true;
                        Context.Field.SetCell(card, point);
                        Context.EventCommunicator.SendFieldMoveEvent(new CardMovementOnFieldEvent()
                        {
                            Card = card,
                            From = from,
                            To = point
                        });
                    }
                    return;
                default:
                    throw new InvalidOperationException();
            }
        }
        private void sendHandsToPlayer(sbyte owner)
        {
            Context.CommunicationHelper.SendMessagePlayer(GameplayClientActionNames.ARRANGE_CARDS, Context.SideContexts[owner].Hand, owner);
        }
    }
}
