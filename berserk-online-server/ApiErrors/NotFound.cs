using berserk_online_server.Facades;

namespace berserk_online_server.ApiErrors
{
    public class NotFound : ApiError
    {
        public NotFound(object? ctx): base(ctx) {
            Message = "Requested resource not found.";
            Id = (int)ApiErrorType.NotFound;
        }
    }
}
