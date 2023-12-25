using berserk_online_server.Interfaces;

namespace berserk_online_server.Implementations
{
    public class AvatarStorage : IAvatarStorage
    {
        private readonly IWebHostEnvironment _env;
        private readonly string _baseUrl;
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
        }

        public string AvatarsFolderPath { get => _env.WebRootPath + "/avatars/"; }
        public string AvatarsUrl { get => _baseUrl + "/avatars/"; }

        public async Task<string> AddAvatar(IFormFile file)
        {
            return await writeFileAsync(file);
        }
        public void DeleteAvatar(string filename)
        {
            File.Delete(Path.Combine(AvatarsFolderPath, filename));
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
        private async Task<string> writeFileAsync(IFormFile data)
        {
            var fileName = Guid.NewGuid().ToString() + '.' + data.FileName.Split('.')[1];
            using (var fs = new FileStream(Path.Combine(AvatarsFolderPath, fileName), FileMode.Create))
            {
                await data.CopyToAsync(fs);
            }
            return fileName;
        }
    }
}
