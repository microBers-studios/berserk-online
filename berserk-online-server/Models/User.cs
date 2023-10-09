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
        public string Name
        {
            get
            {
                return name ?? Email.Split('@')[0];
            }
            set { name = value; }
        }
        private string? name;
    }
}
