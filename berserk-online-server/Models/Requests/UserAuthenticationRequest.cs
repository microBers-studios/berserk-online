using berserk_online_server.Models.Db;
using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace berserk_online_server.Models.Requests
{
    public class UserAuthenticationRequest
    {
        private string _name;
        public UserAuthenticationRequest() { }
        public UserAuthenticationRequest(UserInfo info)
        {
            Name = info.Name;
            Email = info.Email;
            Id = info.Id ?? 0;
        }
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        public int Id { get; set; }
        public string Name
        {
            get
            {
                if (Email != null && _name == null)
                {
                    _name = Email.Split('@')[0];
                }
                return _name;
            }
            set { _name = value; }
        }
        public bool RememberMe { get; set; } = true;
    }
}
