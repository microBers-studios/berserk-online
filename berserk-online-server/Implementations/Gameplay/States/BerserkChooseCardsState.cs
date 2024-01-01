using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Interfaces.Gameplay;

namespace berserk_online_server.Implementations.Gameplay.States
{
    public class BerserkChooseCardsState : BerserkGameplayState
    {
        public BerserkChooseCardsState(BerserkContext context) : base(context)
        {
            dealCards(0);
            dealCards(1);
        }
        public override void Reroll(sbyte owner)
        {
            dealCards(owner);
        }
        public override void SetHand(string[] cardIds, sbyte owner)
        {
            var deck = Context.SideContexts[owner].Deck;
            var hand = Context.SideContexts[owner].Hand;
            foreach (var id in cardIds)
            {
                var index = deck.FindIndex(c => c.Uid == id);
                hand.Add(deck[index]);
                deck.RemoveAt(index);
            }
            checkContextSwitch();
        }
        private void checkContextSwitch()
        {
            if (Context.SideContexts.All(c => c.Hand.Count > 0))
                Context.ChangeState(Context.StateFabric.CreateFieldPreparingState(Context));
        }
        private void dealCards(sbyte owner)
        {
            var cards = Context.SideContexts[owner].Deck.ToList();
            if (cards.Count < 15)
            {
                Context.CommunicationHelper.SendMessagePlayer(GameplayClientActionNames.CHOOSE_CARDS, cards, owner);
            }
            else
            {
                List<PlayableCard> result = new List<PlayableCard>();
                for (int i = 0; i < 15; i++)
                {
                    var randomIndex = Random.Shared.Next(cards.Count);
                    result.Add(cards[randomIndex]);
                    cards.RemoveAt(randomIndex);
                }
                Context.CommunicationHelper.SendMessagePlayer(GameplayClientActionNames.CHOOSE_CARDS, result, owner);
            }
        }
    }
}
