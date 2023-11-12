using BCrypt.Net;
using berserk_online_server.Exceptions;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Repos;
using berserk_online_server.Models.Cards;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using berserk_online_server.Repository;

namespace berserk_online_server.Facades
{

    public class UsersDatabase
    {
        private readonly string _avatarUrlBase;
        private readonly IAvatarStorage _staticContent;
        private readonly IUserRepository _userRepo;
        public DeckDatabase Decks { get; private set; }
        public UsersDatabase(IAvatarStorage staticContent, IDeckBuilder deckBuilder,
            IUserRepository userRepository, IDeckRepository deckRepository)
        {
            _avatarUrlBase = staticContent.AvatarsUrl;
            _staticContent = staticContent;
            _userRepo = userRepository;
            Decks = new DeckDatabase(this, deckBuilder, deckRepository);
        }
        public void AddUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _userRepo.Add(user);
        }
        public void RemoveUser(string email)
        {
            _userRepo.Delete(email);
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
            var foundedUser = _userRepo.GetByInfo(userRequest);
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
            var matchingUser = _userRepo.Get(user.Email);
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
        public class DeckDatabase
        {
            private readonly UsersDatabase _db;
            private readonly IDeckBuilder _deckBuilder;
            private readonly IDeckRepository _deckRepo;
            public DeckDatabase(UsersDatabase db, IDeckBuilder deckBuilder, IDeckRepository deckRepo)
            {
                _db = db;
                _deckBuilder = deckBuilder;
                _deckRepo = deckRepo;
            }
            /// <summary>
            /// 
            /// </summary>
            /// <param name="email"></param>
            /// <returns></returns>
            /// <exception cref="NotFoundException"></exception>
            public Deck[] GetAll(string email)
            {
                var decks = getDecks(new UserInfoRequest() { Email = email });
                return decks.Select(_deckBuilder.BuildFromDb).ToArray();
            }
            /// <summary>
            /// 
            /// </summary>
            /// <param name="id"></param>
            /// <returns></returns>
            /// <exception cref="NotFoundException"></exception>
            public Deck Get(string id)
            {
                var deck = _deckRepo.Get(id);
                return _deckBuilder.BuildFromDb(deck);
            }
            public void Update(DeckRequest deck)
            {
                var deckDb = _deckBuilder.BuildToDb(_deckBuilder.BuildFromRequest(deck));
                _deckRepo.Update(deckDb);
            }
            /// <summary>
            /// 
            /// </summary>
            /// <param name="email"></param>
            /// <param name="id"></param>
            /// <returns></returns>
            /// <exception cref="NotFoundException"></exception>
            public Deck[] Delete(string email, string id)
            {
                _deckRepo.Delete(id);
                return _deckRepo.GetByUser(email).Select(_deckBuilder.BuildFromDb).ToArray();
            }
            public void Add(string email, DeckRequest deck)
            {
                var user = _db._userRepo.Get(email);
                var deckDb = _deckBuilder.BuildToDb(_deckBuilder.BuildFromRequest(deck));
                deckDb.UserId = user.Id;
                _deckRepo.Add(deckDb);
            }
            /// <summary>
            /// 
            /// </summary>
            /// <param name="request"></param>
            /// <returns></returns>
            /// <exception cref="ArgumentNullException"></exception>
            /// <exception cref="NotFoundException"></exception>
            private DeckDb[] getDecks(UserInfoRequest request)
            {
                if (request.Email == null)
                    throw new ArgumentNullException(nameof(request.Email));
                var decks = _deckRepo.GetByUser(request.Email).ToArray();
                return decks;
            }
        }
    }
}
