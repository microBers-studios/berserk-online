using berserk_online_server.Facades.Database;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Repos;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using Microsoft.Extensions.Caching.Memory;
using Moq;

namespace UnitTests.Database
{
    public class UserTests
    {
        private readonly int _id = 1;
        private readonly string _password = "password";
        private readonly string _mail = "test@mail.com";
        private readonly string _expectedName = "test";
        [Fact]
        public void UsernameIfNotImplemented()
        {
            User user = new()
            {
                Email = _mail,
                Password = _password,
            };
            Assert.Equal(_expectedName, user.Name);
        }
        [Fact]
        public void UserToUserInfoCast()
        {
            var user = new User() { Email = _mail, Id = _id, Password = _password };
            var userInfo = new UserInfo(user);
            Assert.Equal(_id, userInfo.Id);
            Assert.Equal(_mail, userInfo.Email);
            Assert.Equal(_expectedName, userInfo.Name);
        }

        [Fact]
        public void AddTest()
        {
            var (repo, db) = createDb();
            var user = new User() { Email = _mail, Password = _password };

            db.AddUser(user);

            Assert.NotEqual(user.Password, _password);
        }
        [Fact]
        public async Task UpdateFromRequestTestAsync()
        {
            var newMail = "newMail@mail.com";
            var newName = "newTestName";
            var (repo, db) = createDb();
            setupUserRepo(repo);
            var userReq = new UserInfoRequest()
            {
                Email = newMail,
                Name = newName,
            };
            var info = await db.UpdateUser(userReq, _mail);

            Assert.NotNull(info);
            Assert.Equal(newMail, info.Email);
            Assert.Equal(newName, info.Name);
        }
        [Fact]
        public async Task UpdateFromUserTest()
        {
            var (repo, db) = createDb();
            setupUserRepo(repo);
            var actualPassword = "";
            repo.Setup(repo => repo.Update(It.IsAny<User>())).Callback((User user) =>
            {
                actualPassword = user.Password;
            });
            var newMail = "newMail@mail.com";
            var newName = "newTestName";
            var newPassword = "new Password";
            var newUser = new User()
            {
                Name = newName,
                Email = newMail,
                Password = newPassword
            };

            var userInfo = db.UpdateUser(newUser, _mail);

            Assert.NotNull(userInfo);
            Assert.Equal(newMail, userInfo.Email);
            Assert.Equal(newName, userInfo.Name);
            Assert.True(BCrypt.Net.BCrypt.Verify(newPassword, actualPassword));
        }
        [Fact]
        public void ConfirmEmailTest()
        {
            var (repo, db) = createDb();
            setupUserRepo(repo);
            User? actualUser = null;
            repo.Setup(repo => repo.Update(It.IsAny<User>())).Callback((User user) =>
            {
                actualUser = user;
            });

            var userInfo = db.ConfirmEmail(_mail);

            Assert.NotNull(actualUser);
            Assert.Equal(_mail, actualUser.Email);
            Assert.True(actualUser.IsEmailConfirmed);
        }
        [Fact]
        public void RemoveAvatarTest()
        {
            var (repo, db) = createDb();
            setupUserRepo(repo);
            User? actualUser = null;
            repo.Setup(repo => repo.Update(It.IsAny<User>())).Callback((User user) =>
            {
                actualUser = user;
            });

            db.RemoveAvatar(_mail);

            Assert.NotNull(actualUser);
            Assert.Null(actualUser.AvatarUrl);
            Assert.Equal(actualUser.Email, _mail);
        }
        [Fact]
        public void VerifyPasswordTest()
        {
            var (repo, db) = createDb();
            setupUserRepo(repo);

            var info = db.VerifyUser(new User()
            {
                Email = _mail,
                Password = _password
            });

            Assert.Equal(_mail, info.Email);
        }

        private Tuple<Mock<IUserRepository>, UsersDatabase> createDb()
        {
            var avatarStorage = new Mock<IAvatarStorage>();
            var deckBuilder = new Mock<IDeckBuilder>();
            var userRepo = new Mock<IUserRepository>();
            var cache = new Mock<ICache<string, User>>();
            User? outVal = null;
            cache.Setup(c => c.Set(It.IsAny<string>(), It.IsAny<User>()));
            cache.Setup(c => c.TryGet(It.IsAny<string>(), out outVal))
                .Returns(false);
            var deckDb = new Mock<IDeckDatabase>();
            return new(userRepo, new UsersDatabase(avatarStorage.Object, userRepo.Object, cache.Object, deckDb.Object));
        }
        private void setupUserRepo(Mock<IUserRepository> repo)
        {
            var userForUpdate = new User()
            {
                Password = BCrypt.Net.BCrypt.HashPassword(_password),
                Email = _mail,
                Name = _expectedName,
                AvatarUrl = "avatarUrl"
            };
            repo.Setup(repo => repo.Get(_mail)).Returns(userForUpdate);
            repo.Setup(repo => repo.GetByInfo(It.Is((UserInfoRequest req) => req.Email == _mail)))
                .Returns(userForUpdate);
        }
    }
}