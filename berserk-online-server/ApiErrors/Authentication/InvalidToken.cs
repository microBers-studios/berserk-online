using berserk_online_server.Utils;
namespace berserk_online_server.ApiErrors.Authentication
{
    public class InvalidToken : ApiError
    {
        public InvalidToken(object? ctx) : base(ctx)
        {
            Id = (int)ApiErrorType.InvalidToken;
            Message = "Token provided in this request is invalid.";
        }
    }
}
