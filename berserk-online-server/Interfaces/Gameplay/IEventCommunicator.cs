using berserk_online_server.Data_objects.Gameplay.Events;

namespace berserk_online_server.Interfaces.Gameplay
{
    public interface IEventCommunicator
    {
        void SendCardChange(CardEvent message);
        void SendChipEvent(ChipEvent message);
        void SendMoveEvent(CardMovementEvent message);
        void SendFieldMoveEvent(CardMovementOnFieldEvent message);
    }
}
