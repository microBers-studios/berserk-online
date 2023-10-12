namespace berserk_online_server.Models.User
{
    public class UserAuthenticationRequest : User
    {
        public UserAuthenticationRequest() { }
        public UserAuthenticationRequest(UserInfo info)
        {
            Name = info.Name;
            Email = info.Email;
            Id = info.Id ?? 0;
        }
        public bool RememberMe { get; set; } = true;
    }
}
