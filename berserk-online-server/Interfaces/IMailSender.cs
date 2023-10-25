namespace berserk_online_server.Interfaces
{
    public interface IMailSender
    {
        public void Send(string to, string token);
    }
}
