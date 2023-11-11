namespace berserk_online_server.Interfaces
{
    public interface IAvatarStorage
    {
        string AvatarsFolderPath { get; }
        string AvatarsUrl { get; }
        Task<string> AddAvatar(IFormFile file, string email);
        Task<string> RenameAvatarByEmail(string oldMail, string newMail);
        void DeleteAvatar(string email);
    }
}
