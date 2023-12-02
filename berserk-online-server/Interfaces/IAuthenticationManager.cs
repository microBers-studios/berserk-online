using berserk_online_server.DTO;
using System.Security.Claims;

namespace berserk_online_server.Interfaces
{
    public interface IAuthenticationManager
    {
        public string AuthenticationScheme { get; set; }
        public Task Authenticate(UserInfo user, bool rememberMe);
        public string GetMail();
        public void LogOut();
        public static string GetMail(ClaimsPrincipal principal)
        {
            return principal.Claims.Where(claim => claim.Type == ClaimTypes.Email)
                .Select(claim => claim.Value)
                .FirstOrDefault()
                ?? throw new ArgumentNullException("claim is null");
        }
    }
}
