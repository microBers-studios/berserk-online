using berserk_online_server.Utils;
namespace berserk_online_server.ApiErrors.Authentication
{
    public class InvalidPassword : ApiError
    {
        public InvalidPassword(object? ctx) : base(ctx)
        {
            Id = (int)ApiErrorType.InvalidPassword;
            Message = "User with this password not found";
        }
    }
}
