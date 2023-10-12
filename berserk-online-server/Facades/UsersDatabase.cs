using BCrypt.Net;
using berserk_online_server.Contexts;
using berserk_online_server.Exceptions;
using berserk_online_server.Models.User;

namespace berserk_online_server.Facades
{

    public class UsersDatabase
    {
        private readonly Databases _db;
        public UsersDatabase(Databases db)
        {
            this._db = db;
        }

        public void AddUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _db.Users.Add(user);
            _db.SaveChanges();
        }
        public void RemoveUser(User user)
        {
            _db.Remove(user);
            _db.SaveChanges();
        }
        public void UpdateUser(User user)
        {
            _db.Users.Update(user);
            _db.SaveChanges();
        }
        public bool IsUnique(User user)
        {
            return !_db.Users.Any(u => u.Email == user.Email);
        }
        public UserInfo GetUserInfo(UserInfoRequest userRequest)
        {
            var foundedUser = findUserFromRequest(userRequest);
            if (foundedUser != null)
            {
                return new UserInfo(foundedUser);
            }
            else
            {
                throw new NotFoundException("User with this name not found.");
            }
        }
        public UserInfo VerifyUser(User user)
        {
            var matchingUser = _db.Users.Where(
                dbUser => dbUser.Email == user.Email
                ).Select(dbUser => dbUser).FirstOrDefault();
            if (matchingUser == null)
                throw new ArgumentException($"User with email: {user.Email} not found!");
            if (!tryVerifyPassword(user, matchingUser))
                throw new UserPasswordException($"User with password: {user.Password} not found!");
            return new UserInfo(matchingUser);
        }
        public void addAvatar(string email, string avatarPath)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == email);
            if (user == null) throw new NotFoundException("user with this email not found.");
            user.AvatarUrl = avatarPath;
            _db.Users.Update(user);
            _db.SaveChanges();
        }
        private bool tryVerifyPassword(User providedUser, User dbUser)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(providedUser.Password, dbUser.Password);
            }
            catch (SaltParseException)
            {
                throw new SaltParseException($"provided password: {providedUser.Password}, hash: {dbUser.Password}");
            }
        }
        private User? findUserFromRequest(UserInfoRequest request)
        {
            return _db.Users.FirstOrDefault(u => (request.Name == null || request.Name == u.Name)
                && (request.Email == null || request.Email == u.Email)
                && (request.Id == null || request.Id == u.Id));
        }
    }
}
