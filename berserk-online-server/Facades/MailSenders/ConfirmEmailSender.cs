namespace berserk_online_server.Facades.MailSenders
{
    public class ConfirmEmailSender : MailSender
    {
        public ConfirmEmailSender(MailClient client, FrontendURLCreator urlCreator) : base(client, urlCreator)
        {
            CreateUrl = urlCreator.GetEmailConfirmationUrl;
        }

        public override void Send(string to, string token)
        {
            var message = CreateUrl(token);
            Client.Send(to, message, "Email confirmation");
        }
    }
}
