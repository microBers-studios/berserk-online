using berserk_online_server.DTO.Models;
using Microsoft.EntityFrameworkCore;

namespace berserk_online_server.Contexts
{
    public class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<DeckDb> Decks { get; set; }
        public DatabaseContext(DbContextOptions options) : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
