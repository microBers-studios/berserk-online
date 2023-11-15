namespace berserk_online_server.Interfaces.Mail
{
    public interface IMailSender
    {
        public void Send(string to, string token);
    }
}
