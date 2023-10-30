using berserk_online_server.Models.User;

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
    }
}