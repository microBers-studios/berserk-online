﻿using berserk_online_server.Models;

namespace UnitTests
{
    public class AvatarTests
    {
        private string _baseUrl = "http://localhost:5200";

        [Fact]
        public void ConstructorTest()
        {
            var avatar = new Avatar(Directory.GetCurrentDirectory(), _baseUrl, "test.png");

        }
    }
}
