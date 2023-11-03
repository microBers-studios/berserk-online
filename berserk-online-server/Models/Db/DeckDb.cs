namespace berserk_online_server.Models.Db
{
    public class DeckDb
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string[] Elements { get; set; }
        public string[] Main { get; set; }
        public string[]? SideBoard { get; set; }
    }
}
