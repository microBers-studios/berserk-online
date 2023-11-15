﻿using berserk_online_server.Facades.CardBase;
using berserk_online_server.Facades.Database;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Repos;
using berserk_online_server.Models.Cards;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using Moq;

namespace UnitTests.Database
{
    public class DeckTests
    {
        private readonly CardProvider _cardProvider = new CardProvider();
        private readonly string _id = "1";
        private readonly string _password = "password";
        private readonly string _mail = "test@mail.com";
        private readonly string _expectedName = "test";
        [Fact]
        public void UpdateTest()
        {
            var (repo, db) = createDb();
            DeckDb? deckDb = null;
            repo.Setup(repo => repo.Update(It.IsAny<DeckDb>())).Callback((DeckDb deck) =>
            {
                deckDb = deck;
            });
            repo.Setup(r => r.Get(It.Is((string id) => id == _id)))
                .Returns(new DeckDb()
                {
                    Id = _id,
                });
            var deckReq = new DeckRequest()
            {
                Main = new[]
                {
                    new DeckCardInfo(_cardProvider.GetCard(0)) { Amount = 1 }
                },
                Name = _expectedName,
                Id = _id,
            };

            db.Update(deckReq);

            Assert.NotNull(deckDb);
            Assert.Equal("0-1", deckDb.Main[0]);
        }
        private Tuple<Mock<IDeckRepository>, IDeckDatabase> createDb()
        {
            var cache = new Mock<ICache<int, DeckDb[]>>();
            DeckDb[]? outVal = null;
            cache.Setup(c => c.TryGet(It.IsAny<int>(), out outVal))
                .Returns(false);
            cache.Setup(c => c.Set(It.IsAny<int>(), It.IsAny<DeckDb[]>()));
            var userRepo = new Mock<IUserRepository>();
            setupUserRepo(userRepo);
            var deckBuilder = new DeckBuilder(_cardProvider);
            var deckRepo = new Mock<IDeckRepository>();
            var db = new DeckDatabase(userRepo.Object, deckBuilder, deckRepo.Object, cache.Object);
            return new(deckRepo, db);
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
