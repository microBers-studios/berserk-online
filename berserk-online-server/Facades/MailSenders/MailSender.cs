using berserk_online_server.Interfaces;

namespace berserk_online_server.Facades.MailSenders
{
    public abstract class MailSender : IMailSender
    {
        public MailClient Client { get; protected set; }
        public Func<string, string> CreateUrl { get; protected set; }
        public MailSender(MailClient client, FrontendURLCreator urlCreator)
        {
            Client = client;
        }
        public abstract void Send(string to, string token);
    }
}
