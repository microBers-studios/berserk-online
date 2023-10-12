namespace berserk_online_server.Models
{
    public class Avatar
    {
        private string _fileName;
        private string _filePath;
        private string _convertedMail;
        public string FileName { get { return _fileName; } }
        public string FilePath { get { return _filePath; } }
        public Avatar(string basePath, IFormFile file, string userMail)
        {
            _fileName = createImageName(file.FileName, userMail);
            _filePath = Path.Combine(basePath, _fileName);
            _convertedMail = _fileName.Split('.')[0];
            createFile(file);
        }
        public Avatar(string basePath, string baseUrl, string fileName)
        {
            _fileName = fileName;
            _filePath = Path.Combine(basePath, _fileName);
            _convertedMail = _fileName.Split('.')[0];
        }
        public async Task Replace(IFormFile newFile)
        {
            string newFileName = combineNameWithExtension(newFile.FileName);
            string newFileBasePath = Path.GetDirectoryName(_filePath);
            string newFilePath = Path.Combine(newFileBasePath, newFileName);
            bool isSuccess = true;
            if (newFilePath == null) { throw new NullReferenceException(nameof(newFilePath)); }
            try
            {
                File.Delete(_filePath);
                var fs = new FileStream(newFilePath, FileMode.Create);
                await newFile.CopyToAsync(fs);
                fs.Dispose();
            }
            catch (Exception)
            {
                isSuccess = false;
            }
            finally
            {
                if (isSuccess)
                {
                    _fileName = newFileName;
                    _filePath = newFilePath;
                }
            }
        }
        private string createImageName(string imgName, string email)
        {
            return $"{email.Replace('@', '_').Replace('.', '-')}.{imgName.Split('.')[1]}";
        }
        private string combineNameWithExtension(string fileName)
        {
            return _convertedMail + "." + fileName.Split('.')[1];
        }
        private void createFile(IFormFile file)
        {
            using (var fs = new FileStream(_filePath, FileMode.Create))
            {
                file.CopyTo(fs);
            }
        }
    }
}
