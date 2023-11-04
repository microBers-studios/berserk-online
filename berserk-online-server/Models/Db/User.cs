using System.ComponentModel.DataAnnotations;

namespace berserk_online_server.Models.Db
{
    public class User
    {

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        public int Id { get; set; }
        public string Name
        {
            get
            {
                if (Email != null && name == null)
                {
                    name = Email.Split('@')[0];
                }
                return name;
            }
            set { name = value; }
        }
        public string? AvatarUrl { get; set; }
        public List<DeckDb> Decks { get; set; } = new List<DeckDb>();
        public bool IsEmailConfirmed { get; set; } = false;
        private string? name;
    }
}
