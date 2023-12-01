using berserk_online_server.Utils;

namespace berserk_online_server.ApiErrors.Authentication
{
    public class RememberMeLost : ApiError
    {
        public RememberMeLost(object? ctx) : base(ctx)
        {
            Message = "Remember me cookie was lost. Now user will be logged out.";
            Id = (int)ApiErrorType.RememberMeLost;
        }
    }
}
