namespace berserk_online_server.Interfaces
{
    public interface ITempRequestsManager<T> where T : IMailSender
    {
        public void Push(string mail);
        public bool IsValid(string token);
        public string GetEmail(string token);
        public void Remove(string token);
    }
}
