using Microsoft.EntityFrameworkCore;
using PongLeaderboard.Models;
using System.Collections.Generic;

namespace PongLeaderboard.Data
{
    public class PongDbContext : DbContext
    {
        public PongDbContext(DbContextOptions<PongDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Score> Scores { get; set; }
    }
}
