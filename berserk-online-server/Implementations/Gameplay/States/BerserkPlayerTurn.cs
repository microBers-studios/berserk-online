using berserk_online_server.Data_objects.Cards;
using berserk_online_server.Data_objects.Gameplay;
using berserk_online_server.DTO.Cards;
using berserk_online_server.Interfaces.Gameplay;
using System.Drawing;

namespace berserk_online_server.Implementations.Gameplay.States
{
    public class BerserkPlayerTurn : BerserkGameplayState
    {
        private readonly byte _owner;
        public BerserkPlayerTurn(BerserkContext context, byte owner) : base(context)
        {
            _owner = owner;
        }
    }
}
