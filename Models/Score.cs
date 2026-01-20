using System;

namespace PongLeaderboard.Models
{
    public class Score
    {
        public int Id { get; set; }

        public int UserId { get; set; }  // foreign key
        
        public User User { get; set; }   // navigation property

        public int Value { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
