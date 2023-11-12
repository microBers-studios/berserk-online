using berserk_online_server.Contexts;
using berserk_online_server.Exceptions;
using berserk_online_server.Interfaces.Repos;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;

namespace berserk_online_server.Repository
{
    public class UserRepository : IUserRepository
    {
        private Databases _db;
        public UserRepository(Databases db)
        {
            _db = db;
        }

        public User Get(string email)
        {
            var user = _db.Users.Where(u => u.Email == email).FirstOrDefault();
            checkIsNull(user);
#pragma warning disable CS8603 // Возможно, возврат ссылки, допускающей значение NULL.
            return user;
#pragma warning restore CS8603 // Возможно, возврат ссылки, допускающей значение NULL.
        }
        public bool IsUnique(UserInfoRequest user)
        {
            return !_db.Users.Any(u => u.Email == user.Email || u.Name == user.Name);
        }
        public User GetByInfo(UserInfoRequest request)
        {
            var user = _db.Users.FirstOrDefault(u => (request.Name == null || request.Name == u.Name)
                && (request.Email == null || request.Email == u.Email)
                && (request.Id == null || request.Id == u.Id));
            checkIsNull(user);
#pragma warning disable CS8603 // Возможно, возврат ссылки, допускающей значение NULL.
            return user;
#pragma warning restore CS8603 // Возможно, возврат ссылки, допускающей значение NULL.
        }
        public void Update(User newUser)
        {
            var oldUser = Get(newUser.Email);
            oldUser.Email = newUser.Email;
            oldUser.Password = newUser.Password;
            oldUser.AvatarUrl = newUser.AvatarUrl;
            oldUser.Name = newUser.Name;
            oldUser.IsEmailConfirmed = newUser.IsEmailConfirmed;
            oldUser.Id = newUser.Id;
            _db.Update(oldUser);
            _db.SaveChanges();
        }
        public void Delete(string email)
        {
            var user = Get(email);
            _db.Users.Remove(user);
            _db.SaveChanges();
        }
        public void Add(User user)
        {
            _db.Users.Add(user);
            _db.SaveChanges();
        }
        private void checkIsNull(object? obj)
        {
            if (obj == null)
                throw new NotFoundException();
        }

    }
}
