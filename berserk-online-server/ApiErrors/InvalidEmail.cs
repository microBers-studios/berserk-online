using berserk_online_server.Facades;
using berserk_online_server.Interfaces;

namespace berserk_online_server.ApiErrors
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
