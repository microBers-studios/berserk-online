using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;

namespace berserk_online_server.Interfaces.Repos
{
    public interface IUserRepository : IRepository<User>
    {
        bool IsUnique(UserInfoRequest request);
        User GetByInfo(UserInfoRequest request);

    }
}
