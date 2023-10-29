using berserk_online_server.Constants;
using berserk_online_server.Models.User;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace berserk_online_server.Facades
{
    public class AuthenticationManager
    {
        private readonly string _authScheme;
        private readonly HttpContext _context;
        public AuthenticationManager(string scheme, HttpContext context)
        {
            _authScheme = scheme;
            _context = context;
        }
        public async Task Authenticate(UserInfo user, bool rememberMe)
        {
            var claims = createClaims(user);
            var claimsIdentity = new ClaimsIdentity(claims,
                _authScheme);
            await _context.SignInAsync(_authScheme, new ClaimsPrincipal(claimsIdentity), new AuthenticationProperties()
            {
                ExpiresUtc = rememberMe ? DateTimeOffset.UtcNow.AddMonths(2) : DateTimeOffset.UtcNow.AddMinutes(20)
            });
            setRememberMeCookie(rememberMe);
        }
        public string GetMail()
        {
            var emailClaim = _context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email);
            if (emailClaim == null) throw new ArgumentNullException("claim is null");
            return emailClaim.Value;
        }
        public void LogOut()
        {
            clearResponseCookies(CookieConstants.AuthenticationCookieName,
                CookieConstants.RememberMeCookieName);
        }
        private void clearResponseCookies(params string[] names)
        {
            foreach (var name in names)
            {
                _context.Response.Cookies.Append(name, "", new CookieOptions()
                {
                    SameSite = SameSiteMode.None,
                    Secure = true
                });
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
        private void setRememberMeCookie(bool rememberMe)
        {
            _context.Response.Cookies.Append(CookieConstants.RememberMeCookieName, rememberMe.ToString(), new CookieOptions()
            {
                SameSite = SameSiteMode.None,
                Secure = true
            });
        }
    }
}
