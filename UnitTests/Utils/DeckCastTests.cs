using berserk_online_server.Facades.CardBase;
using berserk_online_server.Models.Cards;
using berserk_online_server.Models.Db;
using berserk_online_server.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTests.Utils
{
    public class DeckCastTests
    {
        private readonly CardProvider _cardProvider = new CardProvider();
        [Theory]
        [InlineData(data: new object[] {
            new string[]
            {
                "1-1",
                "2-2",
                "145-32"
            }
        })]
        [InlineData(data: new object[] {
            new string[]
            {
                "200-1",
                "129-2",
                "134-32"
            }
        })]
        public void BuildFromDbTest(string[] cards)
        {
            var testDbDeck = new DeckDb()
            {
                Elements = new[]
                {
                    "element1",
                },
                Main = cards,
                Name = "testName",
                Id = "1"
            };
            var deckBuilder = new DeckBuilder(_cardProvider);

            var deck = deckBuilder.BuildFromDb(testDbDeck);

            compareDecks(testDbDeck, deck);
        }
        [Theory]
        [InlineData(new object[]
        {
            new int[]
            {
                1, 2, 3, 4, 5,
            }
        })]
        [InlineData(new object[]
        {
            new int[]
            {
                101, 212, 35, 46, 53,
            }
        })]
        public void BuildToDb(int[] id)
        {
            var deck = new Deck()
            {
                Elements = new[]
                {
                    "element1"
                },
                Id = "1",
                Main = _cardProvider.GetCards(id)
                    .Select(card => new DeckCardInfo(card) { Amount = 1 })
                    .ToArray(),
                Name = "name",
            };
            var deckBuilder = new DeckBuilder(_cardProvider);

            var deckDb = deckBuilder.BuildToDb(deck);

            compareDecks(deckDb, deck);
        }
        [Theory]
        [InlineData(new object[]
        {
            new int[]
            {
                1, 2, 3
            },
            new string[]
            {
                "Степи"
            }
        })]
        [InlineData(new object[]
        {
            new int[]
            {
                1, 65, 70, 112, 151, 172
            },
            new string[]
            {
                "Степи",
                "Горы",
                "Леса",
                "Болота",
                "Тьма",
                "Нейтральная"
            }
        })]
        public void BuildFromRequest(int[] id, string[] expectedElements)
        {
            var request = new DeckRequest()
            {
                Id = "1",
                Name = "name",
                Main = _cardProvider.GetCards(id)
                    .Select(card => new DeckCardInfo(card) { Amount = 1 })
                    .ToArray()
            };
            var deckBuilder = new DeckBuilder(_cardProvider);

            var deck = deckBuilder.BuildFromRequest(request);

            compareReq(request, deck, expectedElements);
        }

        private void compareDecks(DeckDb deckDb, Deck deck)
        {
            Assert.Equal(deckDb.Id, deck.Id);
            Assert.Equal(deckDb.Name, deck.Name);
            Assert.Equal(deckDb.Elements, deck.Elements);
            for (int i = 0; i < deckDb.Main.Length; i++)
            {
                var expectedVals = deckDb.Main[i].Split("-");
                Assert.Equal(int.Parse(expectedVals[0]), deck.Main[i].Id);
                Assert.Equal(int.Parse(expectedVals[1]), deck.Main[i].Amount);
            }
        }
        private void compareReq(DeckRequest request, Deck deck, string[] expectedElements)
        {
            Assert.Equal(request.Id, deck.Id);
            Assert.Equal(request.Name, deck.Name);
            Assert.Equal(deck.Elements, expectedElements);
            for (int i = 0; i < request.Main.Length; i++)
            {
                Assert.Equal(request.Main[i].Id, deck.Main[i].Id);
                Assert.Equal(request.Main[i].Amount, deck.Main[i].Amount);
            }
        }
    }
}
