using berserk_online_server.Interfaces;

namespace berserk_online_server.ApiErrors
{
    public abstract class ApiError : IApiError
    {
        protected ApiError(object? ctx = null)
        {
            Context = ctx;
        }

        public int Id { get; set; }

        public string Message { get; protected set; }

        public object? Context { get; protected set; }
    }
}
