using berserk_online_server.ApiErrors;
using berserk_online_server.Controllers;
using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Facades.MailSenders;
using berserk_online_server.Interfaces;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace UnitTests.Controllers
{
    public class AuthenticationTests
    {
        private Mock<IUsersDatabase> _usersDb;
        private Mock<ITempRequestsManager<RecoveryMailSender>> _recoveryManager;
        private Mock<ITempRequestsManager<ConfirmEmailSender>> _confirmManager;
        private Mock<IAuthenticationManager> _authenticationManager;

        private readonly UserInfo _userInfoMock = new UserInfo()
        {
            Email = "test@email.com",
            Name = "Test",
        };
        private readonly UserAuthenticationRequest _userAuthMock = new UserAuthenticationRequest()
        {
            Email = "test@email.com",
            Name = "Test",
            Password = "1234",
            RememberMe = true
        };
        private readonly UserInfoRequest _userInfoRequestMock = new UserInfoRequest()
        {
            Email = "test@email.com",
            Name = "Test",
        };
        private readonly RecoveryRequestModel _recoveryRequestMock = new RecoveryRequestModel()
        {
            Password = "password",
            Token = "test"
        };

        [Fact]
        public async Task LoginGoodTestAsync()
        {
            var controller = createController();
            _usersDb.Setup((db) => db.VerifyUser(It.Is((UserAuthenticationRequest req) =>
            req.Email == _userAuthMock.Email && req.Name == _userAuthMock.Name && req.Password == _userAuthMock.Password
            ))).Returns(_userInfoMock);

            var info = await controller.Login(_userAuthMock);

            Assert.NotNull(info.Value);
            Assert.Equal(_userInfoMock.Email, info.Value.Email);
        }
        [Fact]
        public async Task LoginBadEmailTestAsync()
        {
            var controller = createController();
            _usersDb.Setup(db => db.VerifyUser(It.IsAny<UserAuthenticationRequest>()))
                .Throws<NotFoundException>();
            var info = await controller.Login(_userAuthMock);

            Assert.IsType<BadRequestObjectResult>(info.Result);
            var res = (BadRequestObjectResult)info.Result;
            Assert.Equal(400, res.StatusCode);
        }
        [Fact]
        public async Task LoginBadPasswordTestAsync()
        {
            var controller = createController();
            _usersDb.Setup(db => db.VerifyUser(It.IsAny<UserAuthenticationRequest>()))
                .Throws<UserPasswordException>();

            var info = await controller.Login(_userAuthMock);

            Assert.IsType<BadRequestObjectResult>(info.Result);
            var res = (BadRequestObjectResult)info.Result;
            Assert.Equal(400, res.StatusCode);
        }
        [Fact]
        public async Task RegisterGoodTestAsync()
        {
            var controller = createController();
            _usersDb.Setup(db => db.IsUnique(It.IsAny<UserInfoRequest>()))
                .Returns(true);

            var info = await controller.Register(_userAuthMock);

            Assert.IsType<OkObjectResult>(info.Result);
            var res = (OkObjectResult)info.Result;
            Assert.NotNull(res.Value);
            var returnedUser = (UserInfo)res.Value;
            Assert.Equal(_userInfoMock.Email, returnedUser.Email);
        }
        [Fact]
        public async Task RegisterNotUniqueTestAsync()
        {
            var controller = createController();
            _usersDb.Setup(db => db.IsUnique(It.IsAny<UserInfoRequest>()))
                .Returns(false);

            var info = await controller.Register(_userAuthMock);

            Assert.IsType<BadRequestObjectResult>(info.Result);
        }
        [Fact]
        public void RequestRecoverGoodTest()
        {
            var controller = createController();
            _usersDb.Setup(db => db.IsUnique(It.Is((UserInfoRequest req) =>
            req.Email == _userAuthMock.Email && req.Name == _userAuthMock.Name)))
                .Returns(false);

            var info = controller.RequestRecover(_userInfoRequestMock);

            Assert.IsType<OkResult>(info);
        }
        [Fact]
        public void RequestRecoverNotExistsTest()
        {
            var controller = createController();
            _usersDb.Setup(db => db.IsUnique(It.Is((UserInfoRequest req) =>
            req.Email == _userAuthMock.Email && req.Name == _userAuthMock.Name)))
                .Returns(true);

            var info = controller.RequestRecover(_userInfoRequestMock);

            Assert.IsType<NotFoundObjectResult>(info);
        }
        [Fact]
        public void ChangePasswordGoodTest()
        {
            var controller = createController();
            _recoveryManager.Setup(mng => mng.GetEmail(It.Is((string token) =>
            token == _recoveryRequestMock.Token))).Returns(_userInfoMock.Email);

            var info = controller.ChangePassword(_recoveryRequestMock);

            Assert.IsType<OkResult>(info);
        }
        [Fact]
        public void ChangePasswordInvalidTokenTest()
        {
            var controller = createController();
            _recoveryManager.Setup(mng => mng.GetEmail(It.IsAny<string>())).Throws(new InvalidOperationException());

            var info = controller.ChangePassword(_recoveryRequestMock);

            Assert.IsType<BadRequestObjectResult>(info);
            var res = (BadRequestObjectResult)info;
            Assert.IsAssignableFrom<ApiError>(res.Value);
            var value = (ApiError)res.Value;
            Assert.Equal((int)ApiErrorType.InvalidToken, value.Id);
        }
        [Fact]
        public void ChangePasswordBadEmailTest()
        {
            var controller = createController();
            _recoveryManager.Setup(mng => mng.GetEmail(It.Is((string token) =>
            token == _recoveryRequestMock.Token))).Returns(_userInfoMock.Email);
            _usersDb.Setup(db =>
            db.UpdateUser(It.IsAny<User>(), It.IsAny<string>()))
                .Throws<NotFoundException>();

            var info = controller.ChangePassword(_recoveryRequestMock);

            Assert.IsType<NotFoundObjectResult>(info);
            var res = (NotFoundObjectResult)info;
            Assert.IsAssignableFrom<ApiError>(res.Value);
            var err = (ApiError)res.Value;
            Assert.Equal((int)ApiErrorType.NotFound, err.Id);
        }
        [Fact]
        public void ConfirmEmailGoodTest()
        {
            var controller = createController();
            _confirmManager.Setup(mng => mng.IsValid(It.Is((string token) =>
            token == _recoveryRequestMock.Token))).Returns(true);
            _confirmManager.Setup(mng => mng.GetEmail(It.Is((string token) =>
            token == _recoveryRequestMock.Token))).Returns(_userInfoMock.Email);
            _usersDb.Setup(db => db.ConfirmEmail(It.Is((string mail) =>
            mail == _userInfoMock.Email))).Returns(_userInfoMock);
            var info = controller.ConfirmEmail(_recoveryRequestMock.Token);

            Assert.IsType<OkObjectResult>(info.Result);
            var res = (OkObjectResult)info.Result;
            Assert.IsType<UserInfo>(res.Value);
        }
        [Fact]
        public void ConfirmInvalidTokenTest()
        {
            var controller = createController();
            _confirmManager.Setup(mng => mng.IsValid(It.Is((string token) =>
            token == _recoveryRequestMock.Token))).Returns(false);
            _confirmManager.Setup(mng => mng.GetEmail(It.Is((string token) =>
            token == _recoveryRequestMock.Token))).Returns(_userInfoMock.Email);
            _usersDb.Setup(db => db.ConfirmEmail(It.Is((string mail) =>
            mail == _userInfoMock.Email))).Returns(_userInfoMock);
            var info = controller.ConfirmEmail(_recoveryRequestMock.Token);

            Assert.IsType<BadRequestObjectResult>(info.Result);
            var res = (BadRequestObjectResult)info.Result;
            Assert.IsAssignableFrom<ApiError>(res.Value);
            var err = (ApiError)res.Value;
            Assert.Equal((int)ApiErrorType.InvalidToken, err.Id);
        }
        [Fact]
        public void ConfirmInvalidEmailTest()
        {
            var controller = createController();
            _confirmManager.Setup(mng => mng.IsValid(It.Is((string token) =>
            token == _recoveryRequestMock.Token))).Returns(true);
            _confirmManager.Setup(mng => mng.GetEmail(It.Is((string token) =>
            token == _recoveryRequestMock.Token))).Throws<InvalidOperationException>();
            _usersDb.Setup(db => db.ConfirmEmail(It.Is((string mail) =>
            mail == _userInfoMock.Email))).Returns(_userInfoMock);
            var info = controller.ConfirmEmail(_recoveryRequestMock.Token);

            Assert.IsType<BadRequestObjectResult>(info.Result);
            var res = (BadRequestObjectResult)info.Result;
            Assert.IsAssignableFrom<ApiError>(res.Value);
            var err = (ApiError)res.Value;
            Assert.Equal((int)ApiErrorType.InvalidToken, err.Id);
        }
        [Fact]
        public void ConfirmNotFoundEmailTest()
        {
            var controller = createController();
            _confirmManager.Setup(mng => mng.IsValid(It.Is((string token) =>
            token == _recoveryRequestMock.Token))).Returns(true);
            _confirmManager.Setup(mng => mng.GetEmail(It.Is((string token) =>
            token == _recoveryRequestMock.Token))).Returns(_userInfoMock.Email);
            _usersDb.Setup(db => db.ConfirmEmail(It.Is((string mail) =>
            mail == _userInfoMock.Email))).Throws<NotFoundException>();
            var info = controller.ConfirmEmail(_recoveryRequestMock.Token);

            Assert.IsType<NotFoundObjectResult>(info.Result);
            var res = (NotFoundObjectResult)info.Result;
            Assert.IsAssignableFrom<ApiError>(res.Value);
            var err = (ApiError)res.Value;
            Assert.Equal((int)ApiErrorType.InvalidEmail, err.Id);
        }
        [Fact]
        public void ConfirmationRequestGoodTest()
        {
            var controller = createController();
            _authenticationManager.Setup(mng => mng.GetMail())
                .Returns(_userInfoMock.Email);

            var info = controller.RequestNewConfirmation();

            Assert.IsType<OkResult>(info);
        }
        [Fact]
        public void ConfirmationRequestNotAuthorizedTest()
        {
            var controller = createController();
            _authenticationManager.Setup(mng => mng.GetMail())
                .Throws<ArgumentNullException>();

            var info = controller.RequestNewConfirmation();

            Assert.IsType<UnauthorizedResult>(info);
        }
        private AuthenticationController createController()
        {
            _usersDb = new();
            _recoveryManager = new();
            _confirmManager = new();
            _authenticationManager = new();
            var controller = new AuthenticationController(_usersDb.Object, _recoveryManager.Object,
                _confirmManager.Object, _authenticationManager.Object);
            return controller;
        }
    }
}
