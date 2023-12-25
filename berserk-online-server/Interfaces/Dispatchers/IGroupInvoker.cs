namespace berserk_online_server.Interfaces.Dispatchers
{
    public interface IGroupInvoker
    {
        Task InvokeClientAsync(string actionName, string roomId);
    }
}
