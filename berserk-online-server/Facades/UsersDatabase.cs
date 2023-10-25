using BCrypt.Net;
using berserk_online_server.Contexts;
using berserk_online_server.Exceptions;
using berserk_online_server.Models.User;
using Microsoft.Extensions.Caching.Memory;

namespace berserk_online_server.Facades
{

    public class UsersDatabase
    {
        private readonly Databases _db;
        public UsersDatabase(Databases db, StaticContentService staticContent)
        {
            _db = db;
            _avatarUrlBase = staticContent.AvatarsUrl;
            _staticContent = staticContent;
        }
        private readonly string _avatarUrlBase;
        private readonly StaticContentService _staticContent;

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
        public async Task<UserInfo> UpdateUser(UserInfoRequest request, string oldMail)
        {
            try
            {
                var user = _db.Users.Where(u => u.Email == oldMail).First();
                mergeUserWithRequest(user, request);
                if (user.AvatarUrl != null && request.Email != null)
                {
                    var avatarName = await _staticContent.RenameAvatarByEmail(oldMail, user.Email);
                    user.AvatarUrl = avatarName;
                }
                _db.Update(user);
                _db.SaveChanges();
                return new UserInfo(formatUser(user));
            }
            catch (InvalidOperationException)
            {
                throw new NotFoundException("user with this email not found");
            }
        }
        public UserInfo UpdateUser(User newUser, string oldmail)
        {
            try
            {
                var user = _db.Users.Where(u => u.Email == oldmail).First();
                user.Email = newUser.Email != null ? newUser.Email : user.Email;
                user.AvatarUrl = newUser.AvatarUrl != null ? newUser.AvatarUrl : user.AvatarUrl;
                user.Password = newUser.Password != null ? BCrypt.Net.BCrypt.HashPassword(newUser.Password)
                    : user.Password;
                user.Name = newUser.Name != null ? newUser.Name : user.Name;
                _db.Update(user);
                _db.SaveChanges();
                return new UserInfo(formatUser(user));
            }
            catch (InvalidOperationException)
            {
                throw new NotFoundException();
            }
        }
        public UserInfo ConfirmEmail(string mail)
        {
            try
            {
                var user = _db.Users.Where(u => u.Email == mail).First();
                user.IsEmailConfirmed = true;
                _db.Update(user);
                _db.SaveChanges();
                return new UserInfo(formatUser(user));
            }
            catch (InvalidOperationException)
            {
                throw new NotFoundException();
            }
        }
        public UserInfo RemoveAvatar(string email)
        {
            try
            {
                var user = _db.Users.Where(u => u.Email == email).First();
                user.AvatarUrl = null;
                _db.Users.Update(user);
                _db.SaveChanges();
                return new UserInfo(formatUser(user));
            }
            catch (InvalidOperationException)
            {
                throw new NotFoundException();
            }
        }
        public bool IsUnique(UserInfoRequest user)
        {
            return !_db.Users.Any(u => u.Email == user.Email || u.Name == user.Name);
        }
        public User GetUser(UserInfoRequest userRequest)
        {
            var foundedUser = findUserFromRequest(userRequest);
            if (foundedUser != null)
            {
                return formatUser(foundedUser);
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
            return new UserInfo(formatUser(matchingUser));
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
        private User formatUser(User user)
        {
            return new User() { Name = user.Name, Email = user.Email, AvatarUrl = _avatarUrlBase + user.AvatarUrl,
            Id = user.Id, IsEmailConfirmed = user.IsEmailConfirmed, Password = user.Password};
        }
        private void mergeUserWithRequest(User u1, UserInfoRequest request)
        {
            u1.Name = request.Name ?? u1.Name;
            u1.Email = request.Email ?? u1.Email;
        }
    }
}
