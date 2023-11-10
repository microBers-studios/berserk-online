using BCrypt.Net;
using berserk_online_server.Contexts;
using berserk_online_server.Exceptions;
using berserk_online_server.Facades.CardBase;
using berserk_online_server.Models.Cards;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using Microsoft.EntityFrameworkCore;

namespace berserk_online_server.Facades
{

    public class UsersDatabase
    {
        private readonly Databases _db;
        private readonly string _avatarUrlBase;
        private readonly StaticContentService _staticContent;
        public DeckDatabase Decks { get; private set; }
        public UsersDatabase(Databases db, StaticContentService staticContent, DeckBuilder deckBuilder)
        {
            _db = db;
            _avatarUrlBase = staticContent.AvatarsUrl;
            _staticContent = staticContent;
            Decks = new DeckDatabase(this, deckBuilder);
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
        public UserInfo ConfirmEmail(string email)
        {
            try
            {
                var user = findUserFromRequest(new UserInfoRequest() { Email = email });
                if (user == null)
                {
                    throw new InvalidOperationException();
                }
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
                var user = findUserFromRequest(new UserInfoRequest() { Email = email });
                if (user == null)
                {
                    throw new InvalidOperationException();
                }
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
                ).FirstOrDefault();
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
            private readonly DeckBuilder _deckBuilder;
            public DeckDatabase(UsersDatabase db, DeckBuilder deckBuilder)
            {
                _db = db;
                _deckBuilder = deckBuilder;
            }
            public Deck[] GetAll(string email)
            {
                var decks = getDecks(new UserInfoRequest() { Email = email });
                return decks.Select(_deckBuilder.BuildFromDb).ToArray();
            }
            public Deck Get(string email, string id)
            {
                var user = _db._db.Users.Include(u => u.Decks).FirstOrDefault(u => u.Email == email);
                if (user == null)
                {
                    throw new InvalidOperationException();
                }
                var deck = user.Decks.FirstOrDefault(u => u.Id == id);
                if (deck == null)
                {
                    throw new NotFoundException();
                }
                return _deckBuilder.BuildFromDb(deck);
            }
            public void Update(string email, DeckRequest deck)
            {
                var user = _db._db.Users.Where(u => u.Email == email).FirstOrDefault();
                if (user == null)
                {
                    throw new InvalidOperationException();
                }
                var newDeck = _deckBuilder.PrepareForDb(_deckBuilder.BuildFromRequest(deck));
                var oldDeck = _db._db.Decks.Where(d => d.Id == newDeck.Id).FirstOrDefault();
                if (oldDeck == null)
                {
                    throw new InvalidDataException();
                }
                oldDeck.Sideboard = newDeck.Sideboard;
                oldDeck.Main = newDeck.Main;
                oldDeck.Name = newDeck.Name;
                oldDeck.Elements = newDeck.Elements;
                _db._db.Update(oldDeck);
                _db._db.SaveChanges();
            }
            public Deck[] Delete(string email, string id)
            {
                var user = _db._db.Users.Include(u => u.Decks).FirstOrDefault(u => u.Email == email);
                if (user == null)
                {
                    throw new InvalidOperationException(nameof(user));
                }
                var decks = user.Decks.ToDictionary(deck => deck.Id);
                try
                {
                    _db._db.Decks.Remove(decks[id]);
                    decks.Remove(id);
                }
                catch (KeyNotFoundException)
                {
                    throw new NotFoundException();
                }
                _db._db.SaveChanges();
                return decks.Select(deck => _deckBuilder.BuildFromDb(deck.Value)).ToArray();
            }
            public void Add(string email, DeckRequest deck)
            {
                var user = _db.findUserFromRequest(new UserInfoRequest() { Email = email });
                if (user == null)
                {
                    throw new InvalidOperationException();
                }
                if (_db._db.Decks.Where(d => d.Id == deck.Id).Any())
                {
                    throw new InvalidDataException();
                }
                var buildedDeck = _deckBuilder.BuildFromRequest(deck);
                var preparedDeck = _deckBuilder.PrepareForDb(buildedDeck);
                user.Decks.Add(preparedDeck);
                _db._db.Update(user);
                _db._db.SaveChanges();
            }
            private DeckDb[] getDecks(UserInfoRequest request)
            {
                var decks = _db._db.Users.Where(u => (request.Name == null || request.Name == u.Name)
                && (request.Email == null || request.Email == u.Email)
                && (request.Id == null || request.Id == u.Id))
                    .Include(u => u.Decks)
                    .Select(u => u.Decks)
                    .FirstOrDefault();
                if (decks == null)
                {
                    throw new InvalidOperationException();
                }
                return decks.ToArray();
            }
        }
    }
}
