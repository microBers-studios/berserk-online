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
            validateFileName(file.FileName);
            _fileName = createImageName(file.FileName, userMail);
            _filePath = Path.Combine(basePath, _fileName);
            _convertedMail = _fileName.Split('.')[0];
            createFile(file);
        }
        public Avatar(string basePath, string baseUrl, string fileName)
        {
            validateFileName(fileName);
            _fileName = fileName;
            _filePath = Path.Combine(basePath, _fileName);
            _convertedMail = _fileName.Split('.')[0];
        }
        public async Task Replace(IFormFile newFile)
        {
            validateFileName(newFile.FileName);
            string newFileName = createImageName(newFile.FileName, _convertedMail);
            string newFileBasePath = Path.GetDirectoryName(_filePath) ?? throw new ArgumentNullException();
            string newFilePath = Path.Combine(newFileBasePath, newFileName);
            bool isSuccess = true;
            if (newFilePath == null) { throw new NullReferenceException(nameof(newFilePath)); }
            try
            {
                File.Delete(_filePath);
                using (var fs = new FileStream(newFilePath, FileMode.Create))
                {
                    await newFile.CopyToAsync(fs);
                };   
            }
            catch (Exception)
            {
                isSuccess = false;
                throw new IOException();
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
        public async Task<string> RenameByMail(string mail)
        {
            var newFileName = createImageName(_fileName, mail);
            var newFilePath = Path.Combine(Path.GetDirectoryName(_filePath) ?? throw new ArgumentNullException(), newFileName);
            if (newFilePath == _filePath) return _fileName;
            await copyFiles(newFilePath);
            File.Delete(_filePath);
            _fileName = newFileName;
            _filePath = newFilePath;
            _convertedMail = newFileName.Split('.')[0];
            return _fileName;
        }
        public void Delete()
        {
            File.Delete(_filePath);
        }

        private async Task copyFiles(string newFilePath)
        {
            using (var fs1 = new FileStream(_filePath, FileMode.Open))
            {
                using (var fs2 = new FileStream(newFilePath, FileMode.Create))
                {
                    await fs1.CopyToAsync(fs2);
                }
            }
        }

        private string createImageName(string imgName, string email)
        {
            return $"{email.Replace('@', '_').Replace('.', '-')}.{imgName.Split('.')[1]}";
        }
        private void createFile(IFormFile file)
        {
            using (var fs = new FileStream(_filePath, FileMode.Create))
            {
                file.CopyTo(fs);
            }
        }
        private void validateFileName(string fileName)
        {
            if (fileName.Split('.').Length < 2)
                throw new FormatException("file name not contain extension name in format: *.ext");
        }
    }
}
