using berserk_online_server.Constants;
using berserk_online_server.Interfaces;
using berserk_online_server.Models.Db;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace berserk_online_server.Facades
{
    public class AuthenticationManager : IAuthenticationManager
    {
        public string AuthenticationScheme { get; set; }
        private readonly IHttpContextAccessor _contextAccessor;
        public AuthenticationManager(IHttpContextAccessor accessor)
        {
            AuthenticationScheme = AuthenticationConstants.DEFAULT_SCHEME;
            _contextAccessor = accessor;
        }
        public async Task Authenticate(UserInfo user, bool rememberMe)
        {
            var claims = createClaims(user);
            var claimsIdentity = new ClaimsIdentity(claims,
                AuthenticationScheme);
            var context = _contextAccessor.HttpContext ?? throw new ArgumentNullException("HttpContext is null");
            await context.SignInAsync(AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), new AuthenticationProperties()
            {
                ExpiresUtc = rememberMe ? DateTimeOffset.UtcNow.AddMonths(2) : DateTimeOffset.UtcNow.AddMinutes(20)
            });
            setRememberMeCookie(rememberMe);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        public string GetMail()
        {
            var context = _contextAccessor.HttpContext ?? throw new ArgumentNullException("HttpContext is null");
            var emailClaim = context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email);
            if (emailClaim == null) throw new ArgumentNullException("claim is null");
            return emailClaim.Value;
        }
        public void LogOut()
        {
            clearResponseCookies(CookieConstants.AUTHENTICATION_COOKIE_NAME,
                CookieConstants.REMEMBER_ME_COOKIE_NAME);
        }
        private void clearResponseCookies(params string[] names)
        {
            var context = _contextAccessor.HttpContext ?? throw new ArgumentNullException("HttpContext is null");
            foreach (var name in names)
            {
                context.Response.Cookies.Append(name, "", new CookieOptions()
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
            var context = _contextAccessor.HttpContext ?? throw new ArgumentNullException("HttpContext is null");
            context.Response.Cookies.Append(CookieConstants.REMEMBER_ME_COOKIE_NAME, rememberMe.ToString(), new CookieOptions()
            {
                SameSite = SameSiteMode.None,
                Secure = true,
                HttpOnly = true
            });
        }
    }
}
