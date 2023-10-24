using berserk_online_server.Facades;

namespace berserk_online_server.Models
{
    public class RecoveryRequest
    {
        public DateTimeOffset Expires { get; private set; }
        public string Token { get; private set; }
        public string Mail { get; private set; }

        public RecoveryRequest(string mail)
        {
            Expires = DateTimeOffset.Now.AddMinutes(20);
            Token = TokenGenerator.Generate();
            Mail = mail;
        }
    }
}
