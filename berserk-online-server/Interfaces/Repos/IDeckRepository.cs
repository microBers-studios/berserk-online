using berserk_online_server.Models.Db;

namespace berserk_online_server.Interfaces.Repos
{
    public interface IDeckRepository : IRepository<DeckDb>
    {
        DeckDb[] GetByUser(string email);
    }
}
