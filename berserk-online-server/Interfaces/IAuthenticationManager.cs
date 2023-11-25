using berserk_online_server.Models.Db;

namespace berserk_online_server.Interfaces
{
    public interface IAuthenticationManager
    {
        public string AuthenticationScheme { get; set; }
        public Task Authenticate(UserInfo user, bool rememberMe);
        public string GetMail();
        public void LogOut();

    }
}
