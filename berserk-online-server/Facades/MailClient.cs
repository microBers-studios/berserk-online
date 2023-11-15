using berserk_online_server.Interfaces.Mail;
using System.Net;
using System.Net.Mail;

namespace berserk_online_server.Facades
{
    public class MailClient : IMailClient
    {
        private readonly SmtpClient _smtpClient;
        private readonly MailAddress _senderAddress;
        private readonly ILogger _logger;
        public MailClient(IConfiguration configuration, ILogger<MailClient> logger)
        {
            var (username, password) = getCredentialsFromConfig(configuration);
            _smtpClient = createSmtpClient(new(username, password));
            _senderAddress = createSenderAddress(username);
            _logger = logger;
        }
        public void Send(string to, string content, string header = "")
        {
            var message = new MailMessage(_senderAddress, new MailAddress(to));
            message.Body = content;
            message.Subject = header;
            try
            {
                _smtpClient.SendAsync(message, null);
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex.Message);
                return;
            }

        }
        private Tuple<string, string> getCredentialsFromConfig(IConfiguration config)
        {
            var username = config.GetSection("Mail:Username").Value;
            var password = config.GetSection("Mail:Password").Value;
            if (username == null || password == null)
            {
                throw new ArgumentNullException("please specify mail credentials.");
            }
            return new(username, password);
        }
        private SmtpClient createSmtpClient(Tuple<string, string> credentials)
        {
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
            smtpClient.UseDefaultCredentials = false;
            smtpClient.EnableSsl = true;
            smtpClient.Credentials = new NetworkCredential(credentials.Item1, credentials.Item2);
            return smtpClient;
        }
        private MailAddress createSenderAddress(string sender)
        {
            return new MailAddress(sender);
        }
    }
}
