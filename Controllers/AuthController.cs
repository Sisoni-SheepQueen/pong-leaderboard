using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PongLeaderboard.Data;
using PongLeaderboard.Models;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace PongLeaderboard.Controllers
{
    public class AuthController : Controller
    {
        private readonly PongDbContext _context;

        public AuthController(PongDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Register() => View();

        [HttpPost]
        public async Task<IActionResult> Register(string username, string password)
        {
            if (await _context.Users.AnyAsync(u => u.Username == username))
            {
                ViewBag.Message = "Username already exists";
                return View();
            }

            var hashed = HashPassword(password);

            var user = new User
            {
                Username = username,
                PasswordHash = hashed,
                Role = "user"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            var hashed = HashPassword(password);
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == hashed);

            if (user == null)
            {
                ViewBag.Message = "Invalid login";
                return View();
            }

            HttpContext.Session.SetString("Username", user.Username);
            HttpContext.Session.SetString("Role", user.Role);
            HttpContext.Session.SetInt32("UserId", user.Id);

            return RedirectToAction("Index", "Game");

        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }
}
