using berserk_online_server.Interfaces.Repos;
using berserk_online_server.Models.Cards;
using berserk_online_server.Models.Db;

namespace berserk_online_server.Repository
{
    public interface IDeckRepository : IRepository<DeckDb>
    {
        DeckDb[] GetByUser(string email);
    }
}
