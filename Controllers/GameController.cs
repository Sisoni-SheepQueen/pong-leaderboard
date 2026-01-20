using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PongLeaderboard.Data;
using PongLeaderboard.Models;

namespace PongLeaderboard.Controllers
{
    public class GameController : Controller
    {
        private readonly PongDbContext _context;

        public GameController(PongDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View(); // показва Pong game
        }

        [HttpPost]
        public IActionResult SaveScore([FromBody] Score scoreData)
        {
            int? userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var score = new Score
            {
                UserId = userId.Value,
                Value = scoreData.Value
            };

            _context.Scores.Add(score);
            _context.SaveChanges();

            return Ok();
        }

        public IActionResult Leaderboard()
        {
            var topScores = _context.Scores
                .Include(s => s.User) // include the related User
                .OrderByDescending(s => s.Value)
                .Take(10)
                .Select(s => new {
                    Username = s.User != null ? s.User.Username : "Unknown",
                    Score = s.Value
                })
                .ToList();

            return View(topScores);
        }


        [HttpPost]
        public IActionResult DeleteScore(string username)
        {
            if (HttpContext.Session.GetString("Role") != "admin")
                return Unauthorized();

            var user = _context.Users.FirstOrDefault(u => u.Username == username);
            if (user == null) return NotFound();

            var scores = _context.Scores.Where(s => s.UserId == user.Id);
            _context.Scores.RemoveRange(scores);
            _context.Users.Remove(user); // ако искаме да изтрием и user
            _context.SaveChanges();

            return RedirectToAction("Leaderboard");
        }

    }

}