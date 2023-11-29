using berserk_online_server.Interfaces;
using berserk_online_server.Models;

namespace berserk_online_server.Facades
{
    public class AvatarStorage : IAvatarStorage
    {
        private IWebHostEnvironment _env;
        private readonly string _baseUrl;
        private Dictionary<string, Avatar> _avatars = new();
        public AvatarStorage(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _env = environment;
#pragma warning disable CS8601 // Возможно, назначение-ссылка, допускающее значение NULL.
            _baseUrl = configuration.GetValue<string>("StaticContentUrl");
#pragma warning restore CS8601 // Возможно, назначение-ссылка, допускающее значение NULL.
            if (string.IsNullOrEmpty(_baseUrl))
            {
                throw new ArgumentNullException("please provide static content url");
            }
            if (!Directory.Exists(AvatarsFolderPath)) createAvatarsFolder();
            else fillAvatarsMap();
        }

        public string AvatarsFolderPath { get => _env.WebRootPath + "/Avatars/"; }
        public string AvatarsUrl { get => _baseUrl + "/Avatars/"; }

        public async Task<string> AddAvatar(IFormFile file, string email)
        {
            var key = createKeyFromEmail(email);
            if (_avatars.ContainsKey(key))
            {
                var avatar = _avatars[key];
                await avatar.Replace(file);
                return avatar.FileName;
            }
            else
            {
                var avatar = new Avatar(AvatarsFolderPath, file, key);
                _avatars.Add(key, avatar);
                return avatar.FileName;
            }
        }
        public async Task<string> RenameAvatarByEmail(string oldMail, string newMail)
        {
            var oldKey = createKeyFromEmail(oldMail);
            if (_avatars.ContainsKey(oldKey))
            {
                var avatar = _avatars[oldKey];
                var avatarName = await avatar.RenameByMail(newMail);
                _avatars.Remove(oldKey);
                _avatars[createKeyFromEmail(newMail)] = avatar;
                return avatarName;
            }
            else
            {
                throw new InvalidOperationException();
            }
        }
        public void DeleteAvatar(string email)
        {
            var key = createKeyFromEmail(email);
            if (_avatars.ContainsKey(key))
            {
                _avatars[key].Delete();
                _avatars.Remove(key);
            }
            else
            {
                throw new InvalidOperationException();
            }
        }
        private void createAvatarsFolder()
        {
            try
            {
                Directory.CreateDirectory(AvatarsFolderPath);
            }
            catch (IOException)
            {
                throw new IOException("Failed to create avatars folder.");
            }
        }
        private void fillAvatarsMap()
        {
            var avatarNames = Directory.GetFiles(AvatarsFolderPath);
            foreach (var avatarPath in avatarNames)
            {
                var avatarName = Path.GetFileName(avatarPath);
                _avatars.Add(createKeyFromFileName(avatarName), new Avatar(AvatarsFolderPath, avatarName));
            }
        }
        private string createKeyFromFileName(string fileName)
        {
            return fileName.Split('.')[0];
        }
        private string createKeyFromEmail(string email)
        {
            return email.Replace('.', '-').Replace('@', '_');
        }
    }
}
