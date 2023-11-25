using berserk_online_server.Controllers;
using berserk_online_server.Exceptions;
using berserk_online_server.Interfaces;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace UnitTests.Controllers
{
    public class UserControllerTests
    {
        private Mock<IUsersDatabase> _usersDb;
        private Mock<IAvatarStorage> _avatarStorage;
        private Mock<IAuthenticationManager> _authenticationManager;
        private readonly UserInfoRequest _requestMock = new UserInfoRequest()
        {
            Email = "test@mail.com",
            Name = "name",
        };

        [Fact]
        public void FindUserGoodTest()
        {
            var controller = createController();
            dbSetup();
            authorizedSetup();

            var info = controller.GetUserInfo(_requestMock);

            Assert.NotNull(info);
            Assert.IsType<OkObjectResult>(info.Result);
        }
        [Fact]
        public void FindUserNotFoundTest()
        {
            var controller = createController();
            dbNotFoundSetup(); authorizedSetup();

            var info = controller.GetUserInfo(_requestMock);

            Assert.NotNull(info);
            Assert.IsType<NotFoundObjectResult>(info.Result);
        }
        [Fact]
        public void GetByIdGoodTest()
        {
            var controller = createController();
            dbSetup(); authorizedSetup();

            var info = controller.GetUser(1);

            Assert.IsType<OkObjectResult>(info.Result);
        }
        [Fact]
        public void GetByIdNotFoundTest()
        {
            var controller = createController();
            dbNotFoundSetup(); authorizedSetup();

            var info = controller.GetUser(1);

            Assert.IsType<NotFoundObjectResult>(info.Result);
        }
        private UserController createController()
        {
            _usersDb = new Mock<IUsersDatabase>();
            _avatarStorage = new Mock<IAvatarStorage>();
            _authenticationManager = new Mock<IAuthenticationManager>();
            var controller = new UserController(_usersDb.Object, _avatarStorage.Object,
                _authenticationManager.Object);
            return controller;
        }

        private void dbNotFoundSetup()
        {
            _usersDb.Setup(db => db.UpdateUser(It.IsAny<User>(), It.IsAny<string>()))
                .Throws<NotFoundException>();
            _usersDb.Setup(db => db.UpdateUser(It.IsAny<UserInfoRequest>(), It.IsAny<string>()))
                .Throws<NotFoundException>();
            _usersDb.Setup(db => db.GetUser(It.IsAny<UserInfoRequest>()))
                .Throws<NotFoundException>();
            _usersDb.Setup(db => db.IsUnique(It.IsAny<UserInfoRequest>()))
                .Returns(true);
            _usersDb.Setup(db => db.RemoveAvatar(It.IsAny<string>()))
                .Throws<NotFoundException>();
        }
        private void dbSetup()
        {
            _usersDb.Setup(db => db.UpdateUser(It.IsAny<User>(), It.IsAny<string>()))
                .Returns(new UserInfo());
            _usersDb.Setup(db => db.UpdateUser(It.IsAny<UserInfoRequest>(), It.IsAny<string>()))
                .Returns(new Task<UserInfo>(() => new UserInfo()));
            _usersDb.Setup(db => db.GetUser(It.IsAny<UserInfoRequest>()))
                .Returns(new User() { Email = _requestMock.Email, Name = _requestMock.Name });
            _usersDb.Setup(db => db.IsUnique(It.IsAny<UserInfoRequest>()))
                .Returns(false);
            _usersDb.Setup(db => db.RemoveAvatar(It.IsAny<string>()))
                .Returns(new UserInfo() { Name = _requestMock.Name, Email = _requestMock.Email });
        }
        private void unauthorizedSetup()
        {
            _authenticationManager.Setup(mng => mng.GetMail()).Throws<ArgumentNullException>();
        }
        private void authorizedSetup()
        {
            _authenticationManager.Setup(mng => mng.GetMail()).Returns(_requestMock.Email);
        }
    }
}
