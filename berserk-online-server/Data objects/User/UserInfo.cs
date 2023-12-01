namespace berserk_online_server.Models.Db
{
    public class UserInfo
    {
        public UserInfo(User user)
        {
            Name = user.Name;
            Email = user.Email;
            Id = user.Id != 0 ? user.Id : null;
            AvatarUrl = user.AvatarUrl;
        }
        public UserInfo()
        {
            Name = "";
            Email = "";
        }
        public string? AvatarUrl { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int? Id { get; set; }
    }
}
