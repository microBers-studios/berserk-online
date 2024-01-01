using berserk_online_server.Constants;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Fabrics;
using berserk_online_server.Interfaces.Gameplay;

namespace berserk_online_server.Implementations.Gameplay.States
{
    public class BerserkDeckChooseState : BerserkGameplayState
    {
        private readonly ILogger<BerserkDeckChooseState> _logger = LoggerFactory.Create(b => b.AddConsole()).CreateLogger<BerserkDeckChooseState>();
        private readonly IPlayableCardFabric _cardFabric;
        private readonly IDeckDatabase _deckDatabase;
        public BerserkDeckChooseState(BerserkContext context, IPlayableCardFabric cardFabric, IDeckDatabase deckDb) : base(context)
        {
            _cardFabric = cardFabric;
            _deckDatabase = deckDb;
            sendChooseMessages();
        }
        public override void SetDeck(string deckId, sbyte owner)
        {
            if (owner < 0 || owner > 1) throw new ArgumentOutOfRangeException();
            var deck = _deckDatabase.Get(deckId);
            Context.SideContexts[owner] = new PlayableSideContext(deck.Main, _cardFabric, owner);
            checkStateSwitch();
            _logger.LogInformation("Player {}, setted deck with id {}", owner, deck.Id);
        }

        private void checkStateSwitch()
        {
            if (Context.SideContexts.All(c => c != null))
            {
                Context.ChangeState(Context.StateFabric.CreateChooseCardsState(Context));
            }
        }
        private void sendChooseMessages()
        {
            for (sbyte i = 0; i < 2; i++)
            {
                var user = Context.Room.Players[i].User;
                var decks = _deckDatabase.GetAll(user.Email);
                Context.CommunicationHelper.SendMessagePlayer(GameplayClientActionNames.CHOOSE_DECK, decks, i);
            }
        }
    }
}
