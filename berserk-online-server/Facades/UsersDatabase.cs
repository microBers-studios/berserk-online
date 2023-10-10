using BCrypt.Net;
using berserk_online_server.Contexts;
using berserk_online_server.Exceptions;
using berserk_online_server.Models;
using Microsoft.AspNetCore.Identity;

namespace berserk_online_server.Facades
{

    public class UsersDatabase
    {
        private readonly Databases db;
        public UsersDatabase(Databases db)
        {
            this.db = db;
        }

        public void AddUser(User user)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            db.Users.Add(user);
            db.SaveChanges();
        }
        public void RemoveUser(User user)
        {
            db.Remove(user);
            db.SaveChanges();
        }
        public void UpdateUser(User user)
        {
            db.Users.Update(user);
            db.SaveChanges();
        }
        public bool IsUnique(User user)
        {
            return !db.Users.Any(u => u.Email == user.Email);
        }
        public User FindMatchingUser(User user)
        {
            var matchingUser = db.Users.Where(
                dbUser => dbUser.Email == user.Email
                ).Select(dbUser => dbUser).FirstOrDefault();
            if (matchingUser == null)
                throw new ArgumentException($"User with email: {user.Email} not found!");
            if (!tryVerifyPassword(user, matchingUser))
                throw new UserPasswordException($"User with password: {user.Password} not found!");
            return matchingUser;
        }
        private bool tryVerifyPassword(User providedUser, User dbUser)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(providedUser.Password, dbUser.Password);
            }
            catch (SaltParseException)
            {
                throw new SaltParseException($"provided password: {providedUser.Password}, hash: {dbUser.Password}");
            }
        }
    }
}
