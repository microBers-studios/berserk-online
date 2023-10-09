namespace berserk_online_server.Interfaces
{
    public interface IApiError
    {
        int Id { get; }
        string Message { get; }
        object? Context { get; }
    }
}
