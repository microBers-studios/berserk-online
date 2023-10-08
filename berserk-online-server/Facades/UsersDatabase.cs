using berserk_online_server.Contexts;
using berserk_online_server.Exceptions;
using berserk_online_server.Models;
using Microsoft.AspNetCore.Identity;

namespace berserk_online_server.Facades
{

    public class UsersDatabase
    {
        private readonly Databases db;
        private readonly IPasswordHasher<User> hasher = new PasswordHasher<User>();
        public UsersDatabase(Databases db)
        {
            this.db = db;
        }

        public void AddUser(User user)
        {
            user.Password = hasher.HashPassword(user, user.Password);
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
            if (!isMatchingPasswords(user, matchingUser))
                throw new UserPasswordException($"User with password: {user.Password} not found!");
            return matchingUser;
        }
        private bool isMatchingPasswords(User providedUser, User dbUser)
        {
            switch(hasher.VerifyHashedPassword(dbUser, dbUser.Password, providedUser.Password))
            {
                case PasswordVerificationResult.Success: return true;
                case PasswordVerificationResult.Failed: return false;
                case PasswordVerificationResult.SuccessRehashNeeded:
                    rehashUserPassword(dbUser);
                    return true;
            }
            throw new Exception();
        }
        private void rehashUserPassword(User user)
        {
            user.Password = hasher.HashPassword(user, user.Password);
            UpdateUser(user);
        }
    }
}
