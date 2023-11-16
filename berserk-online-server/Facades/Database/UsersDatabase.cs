using BCrypt.Net;
using berserk_online_server.Exceptions;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Repos;
using berserk_online_server.Models.Cards;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using Microsoft.Extensions.Caching.Memory;

namespace berserk_online_server.Facades.Database
{

    public class UsersDatabase : IUsersDatabase
    {
        private readonly string _avatarUrlBase;
        private readonly IAvatarStorage _staticContent;
        private readonly IUserRepository _userRepo;
        private readonly ICache<string, User> _memoryCache;
        public IDeckDatabase Decks { get; private set; }
        public UsersDatabase(IAvatarStorage staticContent,
            IUserRepository userRepository, ICache<string, User> cache, IDeckDatabase deckDatabase)
        {
            _memoryCache = cache;
            _avatarUrlBase = staticContent.AvatarsUrl;
            _staticContent = staticContent;
            _userRepo = userRepository;
            Decks = deckDatabase;
        }
        public void AddUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _userRepo.Add(user);
            _memoryCache.Set(user.Email, user);
        }
        public void RemoveUser(string email)
        {
            _userRepo.Delete(email);
            _memoryCache.Remove(email);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <param name="oldMail"></param>
        /// <exception cref="NotFoundException"></exception>
        /// <returns></returns>
        public async Task<UserInfo> UpdateUser(UserInfoRequest request, string oldMail)
        {
            var user = _userRepo.Get(oldMail);
            mergeUserWithRequest(user, request);
            if (user.AvatarUrl != null && request.Email != null)
            {
                var avatarName = await _staticContent.RenameAvatarByEmail(oldMail, user.Email);
                user.AvatarUrl = avatarName;
            }
            _userRepo.Update(user);
            _memoryCache.Remove(oldMail);
            return new UserInfo(formatUser(user));
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="newUser"></param>
        /// <param name="oldmail"></param>
        /// <exception cref="NotFoundException"></exception>
        /// <returns></returns>
        public UserInfo UpdateUser(User newUser, string oldmail)
        {
            var user = _userRepo.Get(oldmail);
            user.Email = newUser.Email != null ? newUser.Email : user.Email;
            user.AvatarUrl = newUser.AvatarUrl != null ? newUser.AvatarUrl : user.AvatarUrl;
            user.Password = newUser.Password != null ? BCrypt.Net.BCrypt.HashPassword(newUser.Password)
                : user.Password;
            user.Name = newUser.Name != null ? newUser.Name : user.Name;
            _userRepo.Update(user);
            _memoryCache.Remove(oldmail);
            return new UserInfo(formatUser(user));
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        /// <exception cref="NotFoundException"></exception>
        public UserInfo ConfirmEmail(string email)
        {
            var user = _userRepo.Get(email);
            user.IsEmailConfirmed = true;
            _userRepo.Update(user);
            _memoryCache.Set(email, user);
            return new UserInfo(formatUser(user));
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        /// <exception cref="NotFoundException"></exception>
        public UserInfo RemoveAvatar(string email)
        {
            var user = _userRepo.Get(email);
            user.AvatarUrl = null;
            _userRepo.Update(user);
            _memoryCache.Set(email, user);
            return new UserInfo(formatUser(user));
        }
        public bool IsUnique(UserInfoRequest user)
        {
            return _userRepo.IsUnique(user);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="userRequest"></param>
        /// <exception cref="NotFoundException"></exception>
        /// <returns></returns>
        public User GetUser(UserInfoRequest userRequest)
        {
            if (_memoryCache.TryGet(userRequest.Email, out User foundedUser))
            { }
            else
            {
                foundedUser = _userRepo.GetByInfo(userRequest);
                _memoryCache.Set(foundedUser.Email, foundedUser);
            }
            return formatUser(foundedUser);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        /// <exception cref="UserPasswordException"></exception>
        /// <exception cref="NotFoundException"></exception>
        public UserInfo VerifyUser(User user)
        {
            var matchingUser = GetUser(new UserInfoRequest() { Email = user.Email, Name = user.Name});
            if (!tryVerifyPassword(user, matchingUser))
                throw new UserPasswordException($"User with password: {user.Password} not found!");
            return new UserInfo(matchingUser);
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
        private User formatUser(User user)
        {
            return new User()
            {
                Name = user.Name,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl != null ? _avatarUrlBase + user.AvatarUrl : null,
                Id = user.Id,
                IsEmailConfirmed = user.IsEmailConfirmed,
                Password = user.Password
            };
        }
        private void mergeUserWithRequest(User u1, UserInfoRequest request)
        {
            u1.Name = request.Name ?? u1.Name;
            u1.Email = request.Email ?? u1.Email;
        }
    }
}
