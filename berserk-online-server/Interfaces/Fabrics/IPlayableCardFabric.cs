using berserk_online_server.Data_objects.Cards;

namespace berserk_online_server.Interfaces.Fabrics
{
    public interface IPlayableCardFabric
    {
        PlayableCard Create(int id, sbyte owner);
    }
}
