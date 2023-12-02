using berserk_online_server.DTO.Models;
using berserk_online_server.DTO.Requests;

namespace berserk_online_server.Interfaces.Repos
{
    public interface IUserRepository : IRepository<User>
    {
        bool IsUnique(UserInfoRequest request);
        User GetByInfo(UserInfoRequest request);

    }
}
