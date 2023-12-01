using berserk_online_server.Constants;
using berserk_online_server.Interfaces;
using berserk_online_server.Utils;

namespace berserk_online_server.Middleware
{
    public class CookieUpdateMiddleware
    {
        private readonly RequestDelegate _next;
        public CookieUpdateMiddleware(RequestDelegate next) { _next = next; }
        public async Task InvokeAsync(HttpContext context, IAuthenticationManager authenticationManager)
        {
            if (!isValidCookie(context, CookieConstants.AUTHENTICATION_COOKIE_NAME))
            {
                await _next.Invoke(context);
                return;
            }
            if (!isValidCookie(context, CookieConstants.REMEMBER_ME_COOKIE_NAME))
            {
                authenticationManager.LogOut();
                writeBadResponse(context);
                return;
            }
            if (!getRememberMe(context))
                new CookieExtender(context).ExtendAll();
            await _next.Invoke(context);
        }
        private bool isValidCookie(HttpContext context, string cookieName)
        {
            return context.Request.Cookies.ContainsKey(cookieName)
                && context.Request.Cookies[cookieName] != "";
        }
        private bool getRememberMe(HttpContext context)
        {
            try
            {
                var rememberMeValue = context.Request.Cookies.First(cookie => cookie.Key == CookieConstants.REMEMBER_ME_COOKIE_NAME).Value;
                return bool.Parse(rememberMeValue);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(ex.Message, ex);
            }
        }
        private void writeBadResponse(HttpContext context)
        {
            context.Response.StatusCode = 403;
            context.Response.WriteAsJsonAsync(ApiErrorFabric.Create(ApiErrorType.RememberMeLost));
        }
    }
}
