namespace berserk_online_server.Facades
{
    public class FrontendURLCreator
    {
        private string _host;
        public FrontendURLCreator(IConfiguration configuration)
        {
            _host = configuration.GetValue<string>("FrontendPath");
            if (string.IsNullOrEmpty(_host) )
            {
                throw new ArgumentNullException("please specify 'FrontendPath' in config");
            }
        }
        public string GetRecoveryUrl(string token)
        {
            return $"{_host}/password?token={token}";
        }
        public string GetEmailConfirmationUrl(string token)
        {
            return $"{_host}/confirmEmail?token={token}";
        }
    }
}
