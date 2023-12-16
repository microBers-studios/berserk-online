using berserk_online_server.ApiErrors;
using berserk_online_server.Controllers;
using berserk_online_server.DTO.Cards;
using berserk_online_server.DTO.Requests;
using berserk_online_server.Exceptions;
using berserk_online_server.Implementations.CardBase;
using berserk_online_server.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace UnitTests.Controllers
{
    public class DeckControllerTests
    {
        private Mock<IUsersDatabase> _usersDb;
        private Mock<IDeckDatabase> _deckDb;
        private Mock<IAuthenticationManager> _authenticationManager;
        private static CardProvider _cardProvider = new CardProvider();
        private readonly Deck _deckMock = new Deck()
        {
            Elements = new[] { "Леса", "Болота", "Нейтральная" },
            Id = "1",
            Main = _cardProvider.GetCards(new[] {
                356, 354, 124, 246, 240, 334, 359, 105, 283, 77
            })
            .Select(x => new DeckCardInfo() { Amount = 1 })
            .ToArray(),
            Name = "test"
        };
        private readonly UserInfo _userMock = new UserInfo()
        {
            Email = "test@mail.com",
            Name = "Test",
        };

        [Fact]
        public void GetMeGoodTest()
        {
            var controller = createController();
            authorizedSetup();
            dbSetup();

            var info = controller.GetMe();

            Assert.IsType<OkObjectResult>(info.Result);
            var res = (OkObjectResult)info.Result;
            Assert.IsType<Deck[]>(res.Value);
            var value = (Deck[])res.Value;
            assertDeck(value[0]);
        }
        [Fact]
        public void GetMeNotAuthorizedTest()
        {
            var controller = createController();
            notAuthorizedSetup();
            dbSetup();

            var info = controller.GetMe();

            Assert.IsType<UnauthorizedResult>(info.Result);
        }
        [Fact]
        public void GetMeNotFoundTest()
        {
            var controller = createController();
            authorizedSetup();
            dbNotFoundSetup();

            var info = controller.GetMe();

            Assert.IsType<NotFoundObjectResult>(info.Result);
            var result = (NotFoundObjectResult)info.Result;
            Assert.IsAssignableFrom<ApiError>(result.Value);
            var error = (ApiError)result.Value;
            Assert.Equal((int)ApiErrorType.NotFound, error.Id);
        }
        [Fact]
        public void GetGoodTest()
        {
            var controller = createController();
            dbSetup();
            authorizedSetup();

            var info = controller.Get(_deckMock.Id);

            Assert.IsType<OkObjectResult>(info.Result);
            var res = (OkObjectResult)info.Result;
            Assert.IsType<Deck>(res.Value);
            var deck = (Deck)res.Value;
            Assert.Equal(_deckMock.Id, deck.Id);
            Assert.Equal(_deckMock.Name, deck.Name);
            Assert.Equal(_deckMock.Elements, deck.Elements);
            Assert.Equal(_deckMock.Main, deck.Main);
        }
        [Fact]
        public void GetNotFoundTest()
        {
            var controller = createController();
            dbNotFoundSetup();
            authorizedSetup();

            var info = controller.Get(_deckMock.Id);

            Assert.IsType<NotFoundObjectResult>(info.Result);
            var result = (NotFoundObjectResult)info.Result;
            Assert.IsAssignableFrom<ApiError>(result.Value);
            var error = (ApiError)result.Value;
            Assert.Equal((int)ApiErrorType.NotFound, error.Id);
        }
        [Fact]
        public void AddGoodTest()
        {
            var controller = createController();
            dbSetup();
            authorizedSetup();

            var info = controller.Add(_deckMock);

            Assert.IsType<OkResult>(info);
        }
        [Fact]
        public void AddNotAuthorizedTest()
        {
            var controller = createController();
            dbSetup();
            notAuthorizedSetup();

            var info = controller.Add(_deckMock);

            Assert.IsType<UnauthorizedResult>(info);
        }
        [Fact]
        public void AddNotFoundTest()
        {
            var controller = createController();
            dbNotFoundSetup();
            authorizedSetup();

            var info = controller.Add(_deckMock);

            Assert.IsType<NotFoundObjectResult>(info);
        }
        [Fact]
        public void AddAlreadyExistsTest()
        {
            var controller = createController();
            authorizedSetup();
            _deckDb.Setup(db => db.Add(It.IsAny<string>(), It.IsAny<DeckRequest>()))
                .Throws<InvalidOperationException>();

            var info = controller.Add(_deckMock);

            Assert.IsType<BadRequestObjectResult>(info);
        }
        [Fact]
        public void UpdateGoodTest()
        {
            var controller = createController();
            dbSetup();
            authorizedSetup();

            var info = controller.Update(_deckMock);

            Assert.IsType<OkResult>(info);
        }
        [Fact]
        public void UpdateNotAuthorizedTest()
        {
            var controller = createController();
            dbSetup();
            notAuthorizedSetup();

            var info = controller.Update(_deckMock);

            Assert.IsType<UnauthorizedResult>(info);
        }
        [Fact]
        public void UpdateNotFoundTest()
        {
            var controller = createController();
            dbNotFoundSetup();
            authorizedSetup();

            var info = controller.Update(_deckMock);

            Assert.IsType<BadRequestObjectResult>(info);
        }
        [Fact]
        public void UpdateForbidTest()
        {
            var controller = createController();
            _deckDb.Setup(db => db.Update(It.IsAny<DeckRequest>(), It.IsAny<string>()))
                .Throws<InvalidOperationException>();
            authorizedSetup();

            var info = controller.Update(_deckMock);

            Assert.IsType<BadRequestObjectResult>(info);
        }
        [Fact]
        public void DeleteGoodTest()
        {
            var controller = createController();
            dbSetup();
            authorizedSetup();

            var info = controller.Delete(_deckMock.Id);

            Assert.IsType<OkObjectResult>(info.Result);
            var res = (OkObjectResult)info.Result;
            Assert.IsType<Deck[]>(res.Value);
            var decks = (Deck[])res.Value;
            Assert.Equal(_deckMock, decks[0]);
        }
        [Fact]
        public void DeleteNotAuthorizedTest()
        {
            var controller = createController();
            dbSetup();
            notAuthorizedSetup();

            var info = controller.Delete(_deckMock.Id);

            Assert.IsType<UnauthorizedResult>(info.Result);
        }
        [Fact]
        public void DeleteNotFoundTest()
        {
            var controller = createController();
            dbNotFoundSetup();
            authorizedSetup();

            var info = controller.Delete(_deckMock.Id);

            Assert.IsType<BadRequestObjectResult>(info.Result);
        }
        [Fact]
        public void DeleteForbiddenTest()
        {
            var controller = createController();
            _deckDb.Setup(db => db.Delete(It.IsAny<string>(), It.IsAny<string>()))
                .Throws<InvalidOperationException>();
            authorizedSetup();

            var info = controller.Delete(_deckMock.Id);

            Assert.IsType<BadRequestObjectResult>(info.Result);
        }
        private DeckController createController()
        {
            _usersDb = new Mock<IUsersDatabase>();
            _deckDb = new Mock<IDeckDatabase>();
            _usersDb.Setup(db => db.Decks).Returns(_deckDb.Object);
            _authenticationManager = new Mock<IAuthenticationManager>();
            var controller = new DeckController(_usersDb.Object,
                _authenticationManager.Object);
            return controller;
        }
        private void notAuthorizedSetup()
        {
            _authenticationManager.Setup(mng => mng.GetMail()).Throws<ArgumentNullException>();
        }
        private void authorizedSetup()
        {
            _authenticationManager.Setup(mng => mng.GetMail()).Returns(_userMock.Email);
        }
        private void dbSetup()
        {
            _deckDb.Setup(db => db.GetAll(It.Is((string mail) =>
            mail == _userMock.Email
            ))).Returns(new[] { _deckMock });
            _deckDb.Setup(db => db.Update(It.Is((DeckRequest req) =>
                req.Id == _deckMock.Id
            ), It.Is((string mail) =>
                mail == _userMock.Email
            )));
            _deckDb.Setup(db => db.Delete(It.IsAny<string>(), It.IsAny<string>()))
                .Returns(new[] { _deckMock });
            _deckDb.Setup(db => db.Get(It.Is((string id) =>
                id == _deckMock.Id
            )))
                .Returns(_deckMock);
        }
        private void dbNotFoundSetup()
        {
            _deckDb.Setup(db => db.GetAll(It.IsAny<string>()))
                .Throws<NotFoundException>();
            _deckDb.Setup(db => db.Update(It.IsAny<DeckRequest>(), It.IsAny<string>()))
                .Throws<NotFoundException>();
            _deckDb.Setup(db => db.Delete(It.IsAny<string>(), It.IsAny<string>()))
                .Throws<NotFoundException>();
            _deckDb.Setup(db => db.Get(It.IsAny<string>()))
                .Throws<NotFoundException>();
            _deckDb.Setup(db => db.Add(It.IsAny<string>(), It.IsAny<DeckRequest>()))
                .Throws<NotFoundException>();
        }
        private void assertDeck(Deck result)
        {
            Assert.Equal(_deckMock.Id, result.Id);
            Assert.Equal(_deckMock.Name, result.Name);
            Assert.Equal(_deckMock.Elements, result.Elements);
            Assert.Equal(_deckMock.Main, result.Main);
        }
    }
}
