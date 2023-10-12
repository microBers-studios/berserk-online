using berserk_online_server.Facades;

namespace berserk_online_server.ApiErrors.Authentication
{
    public class NotAuthorized : ApiError
    {
        public NotAuthorized(object? ctx) : base(ctx)
        {
            Message = "Requester must be authorized.";
            Id = (int)ApiErrorType.NotAuthorized;
        }
    }
}
