
using berserk_online_server.Models;

namespace UnitTests
{
    public class UnitTest1
    {
        [Fact]
        public void UsernameIfNotImplemented()
        {
            var password = "password";
            var mail = "val@mail.com";
            var expectedName = "val";
            User user = new()
            {
                Email = mail,
                Password = password,
            };
            Assert.Equal(expectedName, user.Name);
        }
    }
}