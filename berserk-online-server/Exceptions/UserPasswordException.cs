using System.Data.Common;

namespace berserk_online_server.Exceptions
{
    public class UserPasswordException : DbException
    {
        public UserPasswordException(string message) : base(message) { }
    }
}
