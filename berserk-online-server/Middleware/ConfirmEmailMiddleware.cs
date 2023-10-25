using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Models.User;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace berserk_online_server.Middleware
{
    public class ConfirmEmailMiddleware
    {
        private readonly RequestDelegate _next;
        public ConfirmEmailMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task Invoke(HttpContext context, UsersDatabase db, FrontendURLCreator urlCreator)
        {
            if (context.User.Identity == null || !context.User.Identity.IsAuthenticated 
                || isTryToConfirm(context))
            {
                await _next.Invoke(context);
                return;
            }
            try
            {
                if (!isConfirmed(context, db))
                {
                    writeBadRequest(context);
                    return;
                }
            } catch (Exception) { }
            await _next.Invoke(context);
        }
        private bool isConfirmed(HttpContext context, UsersDatabase db)
        {
            try
            {
                var authManager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme,
                context);
                var user = db.GetUser(new UserInfoRequest() { Email = authManager.GetMail() });
                return user.IsEmailConfirmed;
            }
            catch (NotFoundException)
            {
                throw;
            }
        }
        private void writeBadRequest(HttpContext context)
        {
            context.Response.StatusCode = 403;
            context.Response.WriteAsJsonAsync(ApiErrorFabric.Create(ApiErrorType.EmailNotConfirmed));
        }
        private bool isTryToConfirm(HttpContext context)
        {
            var path = context.Request.Path.Value;
            return path.Contains("confirmEmail") || path.Contains("logout") || path.Contains("login") 
                || path.Contains("register");
        }
    }
}
