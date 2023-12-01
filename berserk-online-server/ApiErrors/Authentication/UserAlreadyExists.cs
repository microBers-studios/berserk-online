using berserk_online_server.Utils;
namespace berserk_online_server.ApiErrors.Authentication
{
    public class UserAlreadyExists : ApiError
    {
        public UserAlreadyExists(object? ctx) : base(ctx)
        {
            Id = (int)ApiErrorType.UserAlreadyExists;
            Message = "User with this credentials already exists";
        }
    }
}
