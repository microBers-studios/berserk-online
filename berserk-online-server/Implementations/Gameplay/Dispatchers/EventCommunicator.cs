using berserk_online_server.Constants;
using berserk_online_server.Data_objects.Gameplay.Events;
using berserk_online_server.Interfaces.Gameplay;

namespace berserk_online_server.Implementations.Gameplay.Dispatchers
{
    public class EventCommunicator : IEventCommunicator
    {
        private readonly ICommunicationHelper _communicationHelper;
        public EventCommunicator(ICommunicationHelper helper)
        {
            _communicationHelper = helper;
        }
        public void SendCardChange(CardEvent message)
        {
            _communicationHelper.SendMessageGroup(GameplayEventNames.CARD_CHANGE, message);
        }

        public void SendChipEvent(ChipEvent message)
        {
            _communicationHelper.SendMessageGroup(GameplayEventNames.CARD_CHIP_CHANGE, message);
        }

        public void SendFieldMoveEvent(CardMovementOnFieldEvent message)
        {
            _communicationHelper.SendMessageGroup(GameplayEventNames.CARD_FIELD_MOVE, message);
        }

        public void SendMoveEvent(CardMovementEvent message)
        {
            _communicationHelper.SendMessageGroup(GameplayEventNames.CARD_MOVE, message);
        }
    }
}
