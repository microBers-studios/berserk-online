using berserk_online_server.Utils;
namespace berserk_online_server.ApiErrors.Authentication
{
    public class InvalidEmail : ApiError
    {
        public InvalidEmail(object? ctx) : base(ctx)
        {
            Id = (int)ApiErrorType.InvalidEmail;
            Message = "User with this email not found.";
        }
    }
}
