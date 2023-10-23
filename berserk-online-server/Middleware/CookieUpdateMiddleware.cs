using berserk_online_server.Constants;
using berserk_online_server.Facades;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace berserk_online_server.Middleware
{
    public class CookieUpdateMiddleware
    {
        private readonly RequestDelegate _next;
        public CookieUpdateMiddleware(RequestDelegate next) { _next = next; }
        public async Task InvokeAsync(HttpContext context)
        {
            if (!isValidCookie(context, CookieConstants.AuthenticationCookieName))
            {
                await _next.Invoke(context);
                return;
            }
            if (!isValidCookie(context, CookieConstants.RememberMeCookieName))
            {
                new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme, context).LogOut();
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
                var rememberMeValue = context.Request.Cookies.First(cookie => cookie.Key == CookieConstants.RememberMeCookieName).Value;
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
