using berserk_online_server.Utils;

namespace berserk_online_server.ApiErrors.Authentication
{
    public class ArgumentsMissing : ApiError
    {
        public ArgumentsMissing(object? ctx) : base(ctx)
        {
            Message = "Some required arguments not provided.";
            Id = (int)ApiErrorType.ArgumentsMissing;
        }
    }
}
