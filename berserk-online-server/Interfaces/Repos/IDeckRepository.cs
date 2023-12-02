using berserk_online_server.DTO.Models;

namespace berserk_online_server.Interfaces.Repos
{
    public interface IDeckRepository : IRepository<DeckDb>
    {
        DeckDb[] GetByUser(string email);
        bool IsUnique(string id);
    }
}
