using berserk_online_server.Utils;

namespace berserk_online_server.ApiErrors
{
    public class NoAccess : ApiError
    {
        public NoAccess(object? ctx) : base(ctx)
        {
            Message = "No access to requested resource";
            Id = (int)ApiErrorType.NoAccess;
        }
    }
}
