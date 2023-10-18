using berserk_online_server.Models.User;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace berserk_online_server.Facades
{
    public class AuthenticationManager
    {
        private readonly string _authScheme;
        public AuthenticationManager(string scheme)
        {
            _authScheme = scheme;
        }
        public async Task Authenticate(UserInfo user, bool rememberMe, HttpContext httpContext)
        {
            var claims = createClaims(user);
            var claimsIdentity = new ClaimsIdentity(claims,
                CookieAuthenticationDefaults.AuthenticationScheme);
            if (rememberMe)
            {
                await httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));
            }
            else
            {
                await httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity), new AuthenticationProperties()
                    { ExpiresUtc = new DateTimeOffset(DateTime.Now).AddHours(2) });
            }
        }
        private Claim[] createClaims(UserInfo user)
        {
            var claims = new[] {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
            };
            return claims;
        }
    }
}
