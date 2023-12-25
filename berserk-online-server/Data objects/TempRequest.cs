namespace berserk_online_server.DTO
{
    public class TempRequest
    {
        public DateTimeOffset Expires { get; private set; }
        public string Token { get; private set; }
        public string Mail { get; private set; }

        public TempRequest(string mail)
        {
            Expires = DateTimeOffset.Now.AddMinutes(20);
            Token = Guid.NewGuid().ToString();
            Mail = mail;
        }
    }
}
