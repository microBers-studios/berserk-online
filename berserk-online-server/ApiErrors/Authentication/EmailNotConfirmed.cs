using berserk_online_server.Utils;

namespace berserk_online_server.ApiErrors.Authentication
{
    public class EmailNotConfirmed : ApiError
    {
        public EmailNotConfirmed(object? ctx) : base(ctx)
        {
            Id = (int)ApiErrorType.EmailNotConfirmed;
            Message = "Requester not confirmed email.";
        }
    }
}
