namespace berserk_online_server.Interfaces.Mail
{
    public interface IMailClient
    {
        void Send(string to, string content, string header = "");

    }
}
