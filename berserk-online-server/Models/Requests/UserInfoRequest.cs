namespace berserk_online_server.Models.Requests
{
    public class UserInfoRequest
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public int? Id { get; set; }

        public bool isEmpty { get => Id == null && Name == null && Email == null; }
    }
}
