using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Mail;

namespace berserk_online_server.Facades.MailSenders
{
    public class RecoveryMailSender : MailSender
    {
        private IUrlCreator _urlCreator;
        public RecoveryMailSender(IMailClient client, IUrlCreator urlCreator) : base(client)
        {
            _urlCreator = urlCreator;
        }

        public override void Send(string to, string token)
        {
            var message = _urlCreator.Create(token, FrontendUrlType.Recovery);
            Client.Send(to, message, "Password recover");
        }
    }
}
