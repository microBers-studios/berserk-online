using berserk_online_server.Models;
using Microsoft.EntityFrameworkCore;

namespace berserk_online_server.Contexts
{
    public class Databases : DbContext
    {
        public DbSet<User> Users { get; set; } = null!;
        public Databases(DbContextOptions options) : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
