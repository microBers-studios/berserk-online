namespace berserk_online_server.Interfaces.Dispatchers
{
    public interface IGroupInvoker
    {
        string GroupId { get; set; }
        Task InvokeClientAsync(string actionName);
    }
}
