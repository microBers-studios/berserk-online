using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Mail;

namespace berserk_online_server.Implementations.MailSenders
{
    public class ConfirmEmailSender : MailSender
    {
        private readonly IUrlCreator _urlCreator;
        public ConfirmEmailSender(IMailClient client, IUrlCreator urlCreator) : base(client)
        {
            _urlCreator = urlCreator;
        }

        public override void Send(string to, string token)
        {
            var message = _urlCreator.Create(token, FrontendUrlType.EmailConfirmation);
            Client.Send(to, message, "Email confirmation");
        }
    }
}
