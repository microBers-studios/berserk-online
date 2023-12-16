using berserk_online_server.DTO;
using berserk_online_server.Implementations.Rooms;

namespace UnitTests.Rooms
{
    public class RoomManagerTests
    {
        private readonly UserInfo _userMock1 = new()
        {
            Email = "test1@mail.com",
            Id = 1,
            Name = "Test",
        };
        private readonly UserInfo _userMock2 = new()
        {
            Email = "test2@mail.com",
            Id = 1,
            Name = "Test",
        };
        private const string ROOM_NAME_MOCK = "name";

        [Fact]
        public void CreateTest()
        {
            var manager = createManager();

            var expectedRoom = manager.Create(ROOM_NAME_MOCK, _userMock1);
            var resultRoom = manager.Get(expectedRoom.Id);

            Assert.NotNull(resultRoom);
        }
        [Fact]
        public void JoinPlayerTest()
        {
            var manager = createManager();

            var room = manager.Create(ROOM_NAME_MOCK, _userMock1);
            manager.JoinPlayer(_userMock2, room.Id);

            Assert.True(findUserInCollection(tupleToArr(room.Players), _userMock2));
            Assert.True(findUserInCollection(tupleToArr(room.Players), _userMock1));
        }
        [Fact]
        public void JoinSpectatorTest()
        {
            var manager = createManager();

            var room = manager.Create(ROOM_NAME_MOCK, _userMock1);
            manager.JoinSpectator(_userMock2, room.Id);

            Assert.True(findUserInCollection(tupleToArr(room.Players), _userMock1));
            Assert.True(findUserInCollection(room.Spectators, _userMock2));
        }
        [Fact]
        public void LeaveTest()
        {
            var manager = createManager();
            var room = manager.Create(ROOM_NAME_MOCK, _userMock1);

            manager.Leave(_userMock1, room.Id);

            Assert.False(findUserInCollection(tupleToArr(room.Players), _userMock1));
        }
        [Fact]
        public void SwitchToPlayerTest()
        {
            var manager = createManager();
            var room = manager.Create(ROOM_NAME_MOCK, _userMock1);

            manager.JoinSpectator(_userMock2, room.Id);
            manager.ToPlayer(_userMock2);

            Assert.True(findUserInCollection(tupleToArr(room.Players), _userMock1));
            Assert.True(findUserInCollection(tupleToArr(room.Players), _userMock2));
        }
        [Fact]
        public void SwitchToSpectatorTest()
        {
            var manager = createManager();
            var room = manager.Create(ROOM_NAME_MOCK, _userMock1);

            manager.JoinPlayer(_userMock2, room.Id);
            manager.ToSpectator(_userMock2);

            Assert.True(findUserInCollection(tupleToArr(room.Players), _userMock1));
            Assert.False(findUserInCollection(tupleToArr(room.Players), _userMock2));
            Assert.True(findUserInCollection(room.Spectators, _userMock2));
        }
        private RoomsManager createManager()
        {
            var userLocationManager = new UserLocationManager();
            var manager = new RoomsManager(userLocationManager);
            return manager;
        }
        private bool findUserInCollection(IEnumerable<UserInfo?> collection, UserInfo user)
        {
            foreach (var item in collection)
            {
                if (item != null && compareUsers(item, user))
                    return true;
            }
            return false;
        }
        private bool compareUsers(UserInfo user1, UserInfo user2)
        {
            return user1.Name == user2.Name && user1.Email == user2.Email &&
                user1.Id == user2.Id && user1.AvatarUrl == user2.AvatarUrl;
        }
        private UserInfo?[] tupleToArr(Tuple<UserInfo?, UserInfo?> tuple)
        {
            return new[] { tuple.Item1, tuple.Item2 };
        }
    }
}
