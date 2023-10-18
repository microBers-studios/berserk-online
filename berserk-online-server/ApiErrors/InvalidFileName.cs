using berserk_online_server.Facades;

namespace berserk_online_server.ApiErrors
{
    public class InvalidFileName : ApiError
    {
        public InvalidFileName(object? ctx) : base(ctx)
        {
            Id = (int)ApiErrorType.InvalidFileName;
            Message = "File name provided in this request not valid.";
        }
    }
}
