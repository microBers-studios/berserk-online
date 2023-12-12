using berserk_online_server.Utils;

namespace berserk_online_server.ApiErrors
{
    public class InvalidFormat : ApiError
    {
        public InvalidFormat(object? ctx): base(ctx)
        {
            Message = "Arguments format is invalid.";
            Id = (int)ApiErrorType.InvalidFormat;
        }
    }
}
