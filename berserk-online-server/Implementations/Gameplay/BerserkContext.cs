using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Gameplay.Events;
using berserk_online_server.Implementations.Gameplay.States;
using berserk_online_server.Interfaces.Fabrics;
using berserk_online_server.Interfaces.Gameplay;

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
        public string ConnectionsGroupId { get; set; }
        public BerserkContext(IGroupDispatcherFabric fabric, string connectionGroupId)
        {
            ConnectionsGroupId = connectionGroupId;
            State = new BerserkGameNotStartedState(this);

            fabric.GroupId = ConnectionsGroupId;
            var additionalCellsDispatcher = fabric.Create<AdditionalCellsEvent>();
            OnAdditionalCellsChange += async message => await additionalCellsDispatcher.DispatchAsync(message, GameplayActionNames.ADDITIONAL_CELLS_CHANGE);
            var cardDispatcher = fabric.Create<CardEvent>();
            OnCardChange += async message => await cardDispatcher.DispatchAsync(message, GameplayActionNames.CARD_CHANGE);
            var movementDispatcher = fabric.Create<CardMovementEvent>();
            OnCardMovement += async message => await movementDispatcher.DispatchAsync(message, GameplayActionNames.CARD_MOVE);
            var chipDispatcher = fabric.Create<ChipEvent>();
            OnChipChange += async message => await chipDispatcher.DispatchAsync(message, GameplayActionNames.CHIP_CHANGE);
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
            throw new NotImplementedException();
        }
    }
}
