using berserk_online_server.Data_objects.Cards;
using berserk_online_server.DTO.Cards;

namespace berserk_online_server.Interfaces
{
    public interface ICardProvider
    {
        DeserealizedCard[] GetAll();
        public DeserealizedCard[] Find(string? query, FilterParams filterParams, int limit);
        public DeserealizedCard GetCard(int id);
        public DeserealizedCard[] GetCards(int[] ids);
    }
}
