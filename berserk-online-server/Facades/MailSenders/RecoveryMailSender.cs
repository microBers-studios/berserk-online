namespace berserk_online_server.Facades.MailSenders
{
    public class RecoveryMailSender : MailSender
    {
        public RecoveryMailSender(MailClient client, FrontendURLCreator urlCreator) : base(client, urlCreator)
        {
            CreateUrl = urlCreator.GetRecoveryUrl;
        }

        public override void Send(string to, string token)
        {
            var message = CreateUrl(token);
            Client.Send(to, message, "Password recover");
        }
    }
}
