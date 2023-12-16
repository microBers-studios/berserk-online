using berserk_online_server.Data_objects.Cards;

namespace berserk_online_server.Interfaces
{
    public interface IPlayableCardFabric
    {
        PlayableCard Create(int id, byte owner);
    }
}
