namespace berserk_online_server.Facades
{
    public static class TokenGenerator
    {
        private const string CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        public static string Generate()
        {
            return new string(Enumerable.Repeat(CHARS, 12).Select(s => s[Random.Shared.Next(s.Length)]).ToArray());
        }
    }
}
