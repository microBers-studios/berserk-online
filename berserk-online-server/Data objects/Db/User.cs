using System.ComponentModel.DataAnnotations;

namespace berserk_online_server.Models.Db
{
    public class User
    {

        [Required]
#pragma warning disable CS8618 // Поле, не допускающее значения NULL, должно содержать значение, отличное от NULL, при выходе из конструктора. Возможно, стоит объявить поле как допускающее значения NULL.
        public string Email { get; set; }
#pragma warning restore CS8618 // Поле, не допускающее значения NULL, должно содержать значение, отличное от NULL, при выходе из конструктора. Возможно, стоит объявить поле как допускающее значения NULL.

        [Required]
#pragma warning disable CS8618 // Поле, не допускающее значения NULL, должно содержать значение, отличное от NULL, при выходе из конструктора. Возможно, стоит объявить поле как допускающее значения NULL.
        public string Password { get; set; }
#pragma warning restore CS8618 // Поле, не допускающее значения NULL, должно содержать значение, отличное от NULL, при выходе из конструктора. Возможно, стоит объявить поле как допускающее значения NULL.
        public int Id { get; set; }
        public string Name
        {
            get
            {
                if (Email != null && name == null)
                {
                    name = Email.Split('@')[0];
                }
#pragma warning disable CS8603 // Возможно, возврат ссылки, допускающей значение NULL.
                return name;
#pragma warning restore CS8603 // Возможно, возврат ссылки, допускающей значение NULL.
            }
            set { name = value; }
        }
        public string? AvatarUrl { get; set; }
        public List<DeckDb> Decks { get; set; } = new List<DeckDb>();
        public bool IsEmailConfirmed { get; set; } = false;
        private string? name;
    }
}
