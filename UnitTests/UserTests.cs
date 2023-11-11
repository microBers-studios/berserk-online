using berserk_online_server.Facades;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Repos;
using berserk_online_server.Models.Db;
using berserk_online_server.Repository;
using Moq;
using System.Security.Cryptography.Xml;

namespace UnitTests
{
    public class UserModels
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
        public void TestAdd()
        {
            var db = createDb();
            var user = new User() { Email = _mail, Password = _password };

            db.AddUser(user);

            Assert.NotEqual(user.Password, _password);
        }

        private UsersDatabase createDb()
        {
            var avatarStorage = new Mock<IAvatarStorage>();
            var deckBuilder = new Mock<IDeckBuilder>();
            var userRepo = new Mock<IUserRepository>();
            var deckRepo = new Mock<IDeckRepository>();
            return new UsersDatabase(avatarStorage.Object, deckBuilder.Object, userRepo.Object, deckRepo.Object);
        }
    }
}