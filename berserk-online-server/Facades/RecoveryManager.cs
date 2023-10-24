using berserk_online_server.Models;

namespace berserk_online_server.Facades
{
    public class RecoveryManager
    {
        //Key is token
        private Dictionary<string, RecoveryRequest> _requests;
        private MailSender _mailSender;
        private FrontendURLCreator _urlCreator;
        public RecoveryManager(MailSender mailSender, FrontendURLCreator urlCreator)
        {
            _requests = new Dictionary<string, RecoveryRequest>();
            _mailSender = mailSender;
            _urlCreator = urlCreator;
        }
        public void Push(string mail)
        {
            var recoveryRequest = new RecoveryRequest(mail);
            _requests[recoveryRequest.Token] = recoveryRequest;
            sendRecoveryMail(mail, recoveryRequest.Token);
        }
        public bool IsValid(string token)
        {
            return _requests.ContainsKey(token) && _requests[token].Expires >= DateTimeOffset.Now;
        }
        public string GetEmail(string token)
        {
            try
            {
                if (IsValid(token))
                {
                    return _requests[token].Mail;
                }
                else
                {
                    Remove(token);
                    throw new KeyNotFoundException();
                }
            }
            catch (KeyNotFoundException)
            {
                throw new InvalidOperationException("token not found: " + token + ".");
            }

        }
        public void Remove(string token)
        {
            _requests.Remove(token);
        }
        private void sendRecoveryMail(string mail, string token)
        {
            _mailSender.Send(mail, _urlCreator.GetRecoveryUrl(token), "Recover your password");
        }
    }
}
