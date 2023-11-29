using berserk_online_server.Facades.Rooms;
using berserk_online_server.Models.Db;

namespace UnitTests.Rooms
{
    public class RoomsTests
    {
        private readonly UserInfo _userMock1 = new UserInfo()
        {
            Email = "test1@mail.com",
            Id = 1,
            Name = "Test1",
        };
        private readonly UserInfo _userMock2 = new UserInfo()
        {
            Email = "test2@mail.com",
            Id = 2,
            Name = "Test2",
        };
        private readonly string _roomNameMock = "testName";
        [Fact]
        public void ConstructorTest()
        {
            var room = new Room(_roomNameMock);

            Assert.Equal(_roomNameMock, room.Name);
        }
        [Fact]
        public void AddPlayerTest()
        {
            var room = new Room(_roomNameMock);

            room.AddPlayer(_userMock1);

            Assert.True(isPlayerInTuple(room.Players, _userMock1));
        }
        [Fact]
        public void AddTwoPlayersTest()
        {
            var room = new Room(_roomNameMock);

            room.AddPlayer(_userMock1);
            room.AddPlayer(_userMock2);

            Assert.True(isPlayerInTuple(room.Players, _userMock1));
            Assert.True(isPlayerInTuple(room.Players, _userMock1));
        }
        [Fact]
        public void RemovePlayerTest()
        {
            var room = new Room(_roomNameMock);

            room.AddPlayer(_userMock1);
            room.RemovePlayer(_userMock1);

            Assert.False(isPlayerInTuple(room.Players, _userMock1));
        }
        [Fact]
        public void TwoUsersRemoveTest()
        {
            var room = new Room(_roomNameMock);

            room.AddPlayer(_userMock2);
            room.AddPlayer(_userMock1);
            room.RemovePlayer(_userMock1);
            room.RemovePlayer(_userMock2);

            Assert.False(isPlayerInTuple(room.Players, _userMock1));
            Assert.False(isPlayerInTuple(room.Players, _userMock2));
        }
        [Fact]
        public void AddSpectatorTest()
        {
            var room = new Room(_roomNameMock);

            room.AddSpectator(_userMock1);

            Assert.True(isPlayerInList(room.Spectators, _userMock1));
        }
        [Fact]
        public void RemoveSpectatorTest()
        {
            var room = new Room(_roomNameMock);

            room.AddSpectator(_userMock1);
            room.RemoveSpectator(_userMock1);

            Assert.False(isPlayerInList(room.Spectators, _userMock1));
        }
        [Fact]
        public void AddMoreSpectators()
        {
            var room = new Room(_roomNameMock);

            room.AddSpectator(_userMock1);
            room.AddSpectator(_userMock2);

            Assert.True(isPlayerInList(room.Spectators, _userMock1));
            Assert.True(isPlayerInList(room.Spectators, _userMock2));
        }
        [Fact]
        public void RemoveMoreSpectators()
        {
            var room = new Room(_roomNameMock);

            room.AddSpectator(_userMock1);
            room.AddSpectator(_userMock2);
            room.RemoveSpectator(_userMock1);
            room.RemoveSpectator(_userMock2);

            Assert.False(isPlayerInList(room.Spectators, _userMock1));
            Assert.False(isPlayerInList(room.Spectators, _userMock2));
        }
        [Fact]
        public void MoveToSpectatorsTest()
        {
            var room = new Room(_roomNameMock);

            room.AddPlayer(_userMock1);
            room.MoveToSpectators(_userMock1);

            Assert.False(isPlayerInTuple(room.Players, _userMock1));
            Assert.True(isPlayerInList(room.Spectators, _userMock1));
        }
        [Fact]
        public void MoveToPlayersTest()
        {
            var room = new Room(_roomNameMock);

            room.AddSpectator(_userMock1);
            room.MoveToPlayers(_userMock1);

            Assert.True(isPlayerInTuple(room.Players, _userMock1));
            Assert.False(isPlayerInList(room.Spectators, _userMock1));
        }
        private bool isPlayerInTuple(Tuple<UserInfo?, UserInfo?> tuple, UserInfo user)
        {
            bool isUserFound = false;
            if (tuple.Item1 != null)
            {
                isUserFound = compareUsers(tuple.Item1, user);
            }
            if (tuple.Item2 != null && !isUserFound)
            {
                isUserFound = compareUsers(tuple.Item2, user);
            }
            return isUserFound;
        }
        private bool isPlayerInList(IEnumerable<UserInfo?> collection, UserInfo user)
        {
            return collection.Any(u => u != null && compareUsers(u, user));
        }
        private bool compareUsers(UserInfo user1, UserInfo user2)
        {
            return user1.Email == user2.Email && user1.Id == user2.Id && user1.AvatarUrl == user2.AvatarUrl
                && user1.Name == user2.Name;
        }
    }
}
