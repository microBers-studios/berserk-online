using berserk_online_server.Interfaces;
using berserk_online_server.Models.Requests;
using berserk_online_server.Utils;

namespace berserk_online_server.Middleware
{
    public class ConfirmEmailMiddleware
    {
        private readonly RequestDelegate _next;
        public ConfirmEmailMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task Invoke(HttpContext context, IUsersDatabase db,
            IAuthenticationManager authenticationManager)
        {
            if (context.User.Identity == null || !context.User.Identity.IsAuthenticated
                || isAllowed(context))
            {
                await _next.Invoke(context);
                return;
            }
            try
            {
                var user = db.GetUser(new UserInfoRequest() { Email = authenticationManager.GetMail() });
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
            context.Response.WriteAsJsonAsync(ApiErrorFabric.Create(ApiErrorType.EmailNotConfirmed, new { email }));
        }
        private bool isAllowed(HttpContext context)
        {
            var path = context.Request.Path.Value;
#pragma warning disable CS8602 // Разыменование вероятной пустой ссылки.
            return path.Contains("confirmEmail") || path.Contains("logout") || path.Contains("login")
                || path.Contains("register") || path.Contains("confirmationRequest");
#pragma warning restore CS8602 // Разыменование вероятной пустой ссылки.
        }
    }
}
