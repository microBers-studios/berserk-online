using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Mail;
using berserk_online_server.Models;

namespace berserk_online_server.Facades
{
    public class TempRequestsManager<T> : ITempRequestsManager<T>
        where T : IMailSender
    {
        //Key is token
        private Dictionary<string, TempRequest> _requests;
        private IMailSender _mailSender;
        public TempRequestsManager(T sender)
        {
            _requests = new Dictionary<string, TempRequest>();
            _mailSender = sender;
        }
        public void Push(string mail)
        {
            var tempRequest = new TempRequest(mail);
            _requests[tempRequest.Token] = tempRequest;
            sendMessage(mail, tempRequest.Token);
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
        private void sendMessage(string mail, string token)
        {
            _mailSender.Send(mail, token);
        }
    }
}
