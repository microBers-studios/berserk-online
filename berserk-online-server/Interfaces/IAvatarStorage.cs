namespace berserk_online_server.Interfaces
{
    public interface IAvatarStorage
    {
        string AvatarsFolderPath { get; }
        string AvatarsUrl { get; }
        Task<string> AddAvatar(IFormFile file);
        void DeleteAvatar(string name);
    }
}
