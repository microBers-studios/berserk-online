using berserk_online_server.Contexts;
using berserk_online_server.Models;

namespace berserk_online_server.Facades
{
    public enum ExistanceStatus
    {
        Exists,
        InvalidPassword,
        NotExists,
    }

    public class UsersDatabase
    {
        private readonly Databases db;
        public UsersDatabase(Databases db)
        {
            this.db = db;
        }

        public void AddUser(User user)
        {
            db.Users.Add(user);
            db.SaveChanges();
        }
        public void RemoveUser(User user)
        {
            db.Remove(user);
            db.SaveChanges();
        }
        public bool IsUnique(User user)
        {
            return !db.Users.Any(u => u.Email == user.Email);
        }
        public ExistanceStatus IsExists(User user)
        {
            var matchingUser = db.Users.Where(
                dbUser => dbUser.Email == user.Email
                ).Select(dbUser => dbUser).First();
            if (matchingUser == null)
                return ExistanceStatus.NotExists;
            if (matchingUser.Password == user.Password)
                return ExistanceStatus.Exists;
            else return ExistanceStatus.InvalidPassword;
        }
    }
}
