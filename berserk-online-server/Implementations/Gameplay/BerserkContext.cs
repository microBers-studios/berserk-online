using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Data_objects.Gameplay.Events;
using berserk_online_server.Data_objects.Gameplay.Requests;
using berserk_online_server.DTO;
using berserk_online_server.DTO.Cards;
using berserk_online_server.Implementations.Gameplay.States;
using berserk_online_server.Interfaces.Fabrics;
using berserk_online_server.Interfaces.Gameplay;
using berserk_online_server.Interfaces.Rooms;
using System.Drawing;

namespace berserk_online_server.Implementations.Gameplay
{
    public class BerserkContext : IGameplayContext
    {
        public event Action<AdditionalCellsEvent> OnAdditionalCellsChange;
        public event Action<CardEvent> OnCardChange;
        public event Action<CardMovementEvent> OnCardMovement;
        public event Action<ChipEvent> OnChipChange;

        public PlayableSideContext[] SideContexts { get; } = new PlayableSideContext[2];
        public BerserkField Field { get; } = new BerserkField();
        public BerserkGameplayState State { get; private set; }
        public string RoomId { get; private set; }
        public IBerserkStateFabric StateFabric { get; private set; }
        public IUserLocationManager LocationManager { get; private set; }
        public IGroupDispatcherFabric GroupDispatcherFabric { get; private set; }
        public BerserkContext(IGroupDispatcherFabric fabric, IBerserkStateFabric stateFabric,IUserLocationManager locationManager, string roomId)
        {
            GroupDispatcherFabric = fabric;
            RoomId = roomId;
            StateFabric = stateFabric;
            LocationManager = locationManager;
            State = new BerserkGameNotStartedState(this);
            var additionalCellsDispatcher = fabric.Create<AdditionalCellsEvent>();
            OnAdditionalCellsChange += async message => await additionalCellsDispatcher.DispatchAsync(message,
                GameplayEventNames.ADDITIONAL_CELLS_CHANGE, RoomId);
            var cardDispatcher = fabric.Create<CardEvent>();
            OnCardChange += async message => await cardDispatcher.DispatchAsync(message, GameplayEventNames.CARD_CHANGE,
                RoomId);
            var movementDispatcher = fabric.Create<CardMovementEvent>();
            OnCardMovement += async message => await movementDispatcher.DispatchAsync(message,
                GameplayEventNames.CARD_MOVE, RoomId);
            var chipDispatcher = fabric.Create<ChipEvent>();
            OnChipChange += async message => await chipDispatcher.DispatchAsync(message,
                GameplayEventNames.CHIP_CHANGE, RoomId);
        }
        public void InvokeEvent(object obj)
        {
            if (obj is AdditionalCellsEvent)
                OnAdditionalCellsChange.Invoke(obj as AdditionalCellsEvent);
            else if (obj is CardEvent)
                OnCardChange.Invoke(obj as CardEvent);
            else if (obj is ChipEvent)
                OnChipChange.Invoke(obj as ChipEvent);
            else if (obj is CardMovementEvent)
                OnCardMovement.Invoke(obj as CardMovementEvent);
        }
        public void ChangeState(BerserkGameplayState state)
        {
            State = state;
        }

        public void Handle(Enum type, object arg, byte owner)
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
                case BerserkActionType.AddExileCard:
                    State.AddExileCard(arg as PlayableCard, owner);
                    return;
                case BerserkActionType.RemoveExileCard:
                    State.RemoveExileCard(arg as PlayableCard, owner);
                    return;
                case BerserkActionType.AddGraveyardCard:
                    State.AddGraveyardCard(owner, arg as PlayableCard);
                    return;
                case BerserkActionType.RemoveGraveyardCard:
                    State.RemoveGraveyardCard(owner, arg as PlayableCard);
                    return;
                case BerserkActionType.AddSymbioteToCard:
                    {
                        var symbioteReq = arg as CardSetRequest;
                        State.AddSymbioteToCard(symbioteReq.Point, symbioteReq.Card);
                    }
                    return;
                case BerserkActionType.RemoveSymbioteFromCard:
                    {
                        var symbioteReq = arg as CardSetRequest;
                        State.RemoveSymbioteFromCard(symbioteReq.Point, symbioteReq.Card);
                    }
                    return;
                case BerserkActionType.SetDeck:
                    State.SetDeck(arg as Deck, owner); return;
                case BerserkActionType.TapCard:
                    State.TapCard((Point)arg);
                    return;
                case BerserkActionType.FlipCard:
                    State.FlipCard((Point)arg);
                    return;
                case BerserkActionType.MoveFieldCard:
                    {
                        var points = arg as MoveRequest;
                        State.MoveFieldCard(points.OldPoint, points.NewPoint, owner);
                    }
                    return;
                case BerserkActionType.RemoveFieldCard:
                    State.RemoveFieldCard((Point)arg, owner); return;
                case BerserkActionType.SetFieldCard:
                    {
                        var setRequestArg = arg as CardSetRequest;
                        State.SetFieldCard(setRequestArg.Point, setRequestArg.Card, owner);
                    }
                    return;
                case BerserkActionType.StartGame:
                    State.StartGame(); return;
            }
        }
        public object Get(Enum type, object arg, byte owner)
        {
            switch ((BerserkGetterType)type)
            {
                case BerserkGetterType.GetFlying:
                    return State.GetFlying((byte)arg, owner);
                case BerserkGetterType.GetDeck:
                    return State.GetDeck((byte)arg, owner);
                case BerserkGetterType.GetExile:
                    return State.GetExile((byte)arg, owner);
                case BerserkGetterType.GetGraveyard:
                    return State.GetGraveyard((byte)arg, owner);
            }
            throw new NotImplementedException();
        }
        private void sendPlayerIds(UserInfo[] users)
        {
            var dispatcher = GroupDispatcherFabric.Create<byte>(RoomId);
            for (byte i = 0; i < 2; i++)
            {
                //Твоя задача состоит в том чтобы написать еще один ебаный диспатчер но только для одного конкретного подключения
            }
        }
    }
}
