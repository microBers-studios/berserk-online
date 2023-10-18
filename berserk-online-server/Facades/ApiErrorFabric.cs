using berserk_online_server.ApiErrors;
using berserk_online_server.ApiErrors.Authentication;
using berserk_online_server.Interfaces;

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
    }
    public static class ApiErrorFabric
    {
        public static IApiError Create(ApiErrorType errorType, object? ctx = null)
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
            }
            throw new NotImplementedException();
        }
    }
}
