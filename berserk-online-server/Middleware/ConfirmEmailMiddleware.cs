using berserk_online_server.Exceptions;
using berserk_online_server.Facades;
using berserk_online_server.Models.Requests;
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
                var authManager = new AuthenticationManager(CookieAuthenticationDefaults.AuthenticationScheme,
                context);
                var user = db.GetUser(new UserInfoRequest() { Email = authManager.GetMail() });
                if (!user.IsEmailConfirmed)
                {
                    writeBadRequest(context, user.Email);
                    return;
                }
            }
            catch (Exception) { }
            await _next.Invoke(context);
        }
        private void writeBadRequest(HttpContext context, string email)
        {
            context.Response.StatusCode = 403;
            context.Response.WriteAsJsonAsync(ApiErrorFabric.Create(ApiErrorType.EmailNotConfirmed, new {email}));
        }
        private bool isTryToConfirm(HttpContext context)
        {
            var path = context.Request.Path.Value;
#pragma warning disable CS8602 // Разыменование вероятной пустой ссылки.
            return path.Contains("confirmEmail") || path.Contains("logout") || path.Contains("login")
                || path.Contains("register") || path.Contains("confirmationRequest");
#pragma warning restore CS8602 // Разыменование вероятной пустой ссылки.
        }
    }
}
