using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Gameplay.Requests;
using berserk_online_server.Implementations.Gameplay.States;
using berserk_online_server.Interfaces.Fabrics;
using berserk_online_server.Interfaces.Gameplay;
using berserk_online_server.Interfaces.Rooms;
using System.Drawing;

namespace berserk_online_server.Implementations.Gameplay
{
    public class BerserkContext : IGameplayContext
    {

        public PlayableSideContext[] SideContexts { get; } = new PlayableSideContext[2];
        public BerserkField Field { get; } = new BerserkField();
        public BerserkGameplayState State { get; private set; }
        public IRoom Room { get; private set; }
        public IUserLocationManager LocationManager { get; private set; }
        public IGroupDispatcherFabric GroupDispatcherFabric { get; private set; }
        public IBerserkStateFabric StateFabric { get; private set; }
        public ICommunicationHelper CommunicationHelper { get; private set; }
        public IEventCommunicator EventCommunicator { get; private set; }

        public BerserkContext(IRoom room, IGroupDispatcherFabric fabric, ICommunicationHelper communicationHelper, 
            IBerserkStateFabric stateFabric, IEventCommunicator eventCommunicator)
        {
            communicationHelper.RoomId = room.Id;
            CommunicationHelper = communicationHelper;
            GroupDispatcherFabric = fabric;
            StateFabric = stateFabric;
            Room = room;
            State = new BerserkGameNotStartedState(this);
            EventCommunicator = eventCommunicator;
        }
        public void ChangeState(BerserkGameplayState state)
        {
            State = state;
        }

        public void Handle(Enum type, object arg, sbyte owner)
        {
            switch ((BerserkActionType)type)
            {
                case BerserkActionType.AddChip:
                    {
                        var chipReq = arg as ChipRequest;
                        State.AddChip(chipReq.Point, chipReq.Chip);
                    }
                    return;
                case BerserkActionType.RemoveChip:
                    {
                        var chipReq = arg as ChipRequest;
                        State.RemoveChip(chipReq.Point, chipReq.Chip);
                    }
                    return;
                case BerserkActionType.EditChip:
                    {
                        var chipReq = arg as ChipEditRequest;
                        State.EditChip(chipReq.Point, chipReq.Chip, chipReq.TargetId);
                    }
                    return;
                case BerserkActionType.AddChipToCard:
                    {
                        var chipReq = arg as ChipRequest;
                        State.AddChipToCard(chipReq.Point, chipReq.Chip);
                    }
                    return;
                case BerserkActionType.SetDeck:
                    State.SetDeck(arg as string, owner); return;
                case BerserkActionType.TapCard:
                    State.TapCard((Point)arg);
                    return;
                case BerserkActionType.FlipCard:
                    State.FlipCard((Point)arg);
                    return;
                case BerserkActionType.MoveCard:
                    {
                        var moveReq = arg as CardMoveRequest;
                        State.MoveCard(moveReq.From, moveReq.To, moveReq.CardId);
                    }
                    return;
                case BerserkActionType.MoveCardToField:
                    {
                        var moveReq = arg as CardMoveToFieldRequest;
                        State.MoveCardToField(moveReq.From, moveReq.Point, moveReq.CardId);
                    }
                    return;
                case BerserkActionType.MoveSymbioteToCard:
                    {
                        var symbioteReq = arg as SymbioteMoveToCardRequest;
                        State.MoveSymbioteToCard(symbioteReq.From, symbioteReq.SymbioteId, symbioteReq.TargetId);
                    }
                    return;
                case BerserkActionType.MoveSymbioteFromCard:
                    {
                        var symbioteReq = arg as SymbioteMoveFromCardRequest;
                        State.MoveSymbioteFromCard(symbioteReq.To, symbioteReq.SymbioteId);
                    }
                    return;
                case BerserkActionType.Reroll:
                    State.Reroll(owner);
                    return;
                case BerserkActionType.SetHand:
                    {
                        var cardsArg = arg as string[];
                        State.SetHand(cardsArg, owner);
                    }
                    return;
            }
        }
        public object Get(Enum type, object arg, sbyte owner)
        {
            switch ((BerserkGetterType)type)
            {
                case BerserkGetterType.GetFlying:
                    return State.GetFlying((sbyte)arg, owner);
                case BerserkGetterType.GetDeck:
                    return State.GetDeck((sbyte)arg, owner);
                case BerserkGetterType.GetExile:
                    return State.GetExile((sbyte)arg, owner);
                case BerserkGetterType.GetGraveyard:
                    return State.GetGraveyard((sbyte)arg, owner);
            }
            throw new NotImplementedException();
        }
        public void StartGame()
        {
            State.StartGame();
        }
    }
}
