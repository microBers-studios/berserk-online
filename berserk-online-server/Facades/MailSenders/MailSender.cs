using berserk_online_server.Interfaces.Mail;

namespace berserk_online_server.Facades.MailSenders
{
    public abstract class MailSender : IMailSender
    {
        public IMailClient Client { get; protected set; }
        public MailSender(IMailClient client)
        {
            Client = client;
        }
        public abstract void Send(string to, string token);
    }
}
