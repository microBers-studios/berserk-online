using System.ComponentModel.DataAnnotations;

namespace berserk_online_server.Models
{
    public class User
    {

        [Required]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }
        public int Id { get; set; }
        public string Name { get {
                return name != null? name : Email.Split('@')[0];
            }
            set { name = value; }
        }
        private string? name;
        private string getName()
        {
            if (Name == null)
            {
                return generateName();
            }
            return Name;
        }
        private string generateName()
        {
            return Email.Split('@')[0];
        }
    }
}
