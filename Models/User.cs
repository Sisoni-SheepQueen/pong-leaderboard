using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PongLeaderboard.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "user";

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation property
        public ICollection<Score> Scores { get; set; }
    }
}
