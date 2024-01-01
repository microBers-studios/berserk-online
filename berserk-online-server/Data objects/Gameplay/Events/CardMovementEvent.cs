﻿using berserk_online_server.Data_objects.Cards;
using System.Drawing;

namespace berserk_online_server.Data_objects.Gameplay.Events
{
    public sealed class CardMovementEvent
    {
        public BerserkCardMoveTarget From { get; set; }
        public BerserkCardMoveTarget To { get; set; }
        public PlayableCard Card { get; set; }
    }
}
