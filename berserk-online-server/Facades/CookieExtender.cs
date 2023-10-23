using berserk_online_server.Constants;

namespace berserk_online_server.Facades
{
    public class CookieExtender
    {
        private HttpContext _context;
        public CookieExtender(HttpContext context)
        {
            _context = context;
        }
        public void ExtendAll()
        {
            var oldCookies = getCookies();
            foreach (var cookie in oldCookies)
            {
                extendCookie(cookie.Key, cookie.Value);
            }
            extendToken();
        }
        public void Extend(string cookieName)
        {
            try
            {
                var cookie = getCookie(cookieName);
                extendCookie(cookie.Key, cookie.Value);
            } 
            catch (InvalidOperationException)
            {
                return;
            }
            
        }
        private Dictionary<string, string> getCookies()
        {
            var cookieList = _context.Request.Cookies.Where(cookie => cookie.Key != CookieConstants.AuthenticationCookieName).Select(cookie => cookie).ToList();
            var cookieDictionary = new Dictionary<string, string>();
            foreach (var cookie in cookieList)
            {
                cookieDictionary.Add(cookie.Key, cookie.Value);
            }
            return cookieDictionary;
        }
        private KeyValuePair<string, string> getCookie(string name)
        {
            try
            {
                return _context.Request.Cookies.First(cookie => cookie.Key == name);
            } catch (Exception)
            {
                throw new InvalidOperationException("cookie with name " + name + " not found");
            }
            
        }
        private void extendToken()
        {
            try
            {
                var tokenValue = getCookie(CookieConstants.AuthenticationCookieName).Value;
                extendCookie(CookieConstants.AuthenticationCookieName, tokenValue, httpOnly: true);
            }
            catch (Exception)
            {
                return;
            }
        }
        private void extendCookie(string name, string value, bool sameSite = false, bool httpOnly = false)
        {
            _context.Response.Cookies.Append(name, value, new CookieOptions()
            {
                Expires = DateTime.Now.AddMinutes(20),
                SameSite = sameSite ? SameSiteMode.Lax : SameSiteMode.None,
                Secure = true,
                HttpOnly = httpOnly
            });
        }
    }
}
