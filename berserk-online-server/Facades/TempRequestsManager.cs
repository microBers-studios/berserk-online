using berserk_online_server.DTO;
using berserk_online_server.Interfaces;
using berserk_online_server.Interfaces.Mail;

namespace berserk_online_server.Facades
{
    public class TempRequestsManager<T> : ITempRequestsManager<T>
        where T : IMailSender
    {
        //Key is token
        private Dictionary<string, TempRequest> _requests;
        private IMailSender _mailSender;
        private const int GARBAGE_REMOVE_DELAY_MS = 15 * 60 * 1000;
        public TempRequestsManager(T sender)
        {
            _requests = new Dictionary<string, TempRequest>();
            _mailSender = sender;
            new Timer((state) =>
            {
                foreach (var request in _requests.Values)
                {
                    clearGarbage(request);
                }
            }, null, GARBAGE_REMOVE_DELAY_MS, GARBAGE_REMOVE_DELAY_MS);
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
        private void clearGarbage(TempRequest request)
        {
            if (DateTime.Now > request.Expires)
            {
                _requests.Remove(request.Token);
            }
        }
    }
}
