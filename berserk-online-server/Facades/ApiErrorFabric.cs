using berserk_online_server.ApiErrors;
using berserk_online_server.ApiErrors.Authentication;

namespace berserk_online_server.Facades
{
    public enum ApiErrorType
    {
        InvalidEmail = 1,
        InvalidPassword,
        UserAlreadyExists,
        NotFound,
        ArgumentsMissing,
        InvalidFileName,
        RememberMeLost,
        InvalidToken,
        EmailNotConfirmed
    }
    public static class ApiErrorFabric
    {
        public static ApiError Create(ApiErrorType errorType, object? ctx = null)
        {
            switch (errorType)
            {
                case ApiErrorType.InvalidEmail:
                    return new InvalidEmail(ctx);
                case ApiErrorType.InvalidPassword:
                    return new InvalidPassword(ctx);
                case ApiErrorType.UserAlreadyExists: 
                    return new UserAlreadyExists(ctx);
                case ApiErrorType.NotFound:
                    return new NotFound(ctx);
                case ApiErrorType.ArgumentsMissing:
                    return new ArgumentsMissing(ctx);
                case ApiErrorType.InvalidFileName:
                    return new InvalidFileName(ctx);
                case ApiErrorType.RememberMeLost:
                    return new RememberMeLost(ctx);
                case ApiErrorType.InvalidToken:
                    return new InvalidToken(ctx);
                case ApiErrorType.EmailNotConfirmed:
                    return new EmailNotConfirmed(ctx);
            }
            throw new NotImplementedException();
        }
    }
}
