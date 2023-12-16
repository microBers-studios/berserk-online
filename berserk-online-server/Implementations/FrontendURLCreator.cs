using berserk_online_server.Interfaces;

namespace berserk_online_server.Implementations
{
    public enum FrontendUrlType
    {
        Recovery,
        EmailConfirmation
    }
    public class FrontendURLCreator : IUrlCreator
    {
        private string _host;
        public FrontendURLCreator(IConfiguration configuration)
        {
#pragma warning disable CS8601 // Возможно, назначение-ссылка, допускающее значение NULL.
            _host = configuration.GetValue<string>("FrontendPath");
#pragma warning restore CS8601 // Возможно, назначение-ссылка, допускающее значение NULL.
            if (string.IsNullOrEmpty(_host))
            {
                throw new ArgumentNullException("please specify 'FrontendPath' in config");
            }
        }
        public string Create(string token, FrontendUrlType type)
        {
            switch (type)
            {
                case FrontendUrlType.Recovery:
                    return getRecoveryUrl(token);
                case FrontendUrlType.EmailConfirmation:
                    return getEmailConfirmationUrl(token);
            }
            throw new NotImplementedException();
        }
        private string getRecoveryUrl(string token)
        {
            return $"{_host}/password?token={token}";
        }
        private string getEmailConfirmationUrl(string token)
        {
            return $"{_host}/confirmEmail?token={token}";
        }
    }
}
