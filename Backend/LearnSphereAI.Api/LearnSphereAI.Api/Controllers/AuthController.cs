using LearnSphereAI.Api.Data;
using LearnSphereAI.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnSphereAI.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly AppDbContext _context;

		// Inject the database context so we can talk to SSMS
		public AuthController(AppDbContext context)
		{
			_context = context;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] UserRegisterDto request)
		{
			// 1. Check if user already exists
			if (await _context.Users.AnyAsync(u => u.Email == request.Email))
			{
				return BadRequest("Email already exists.");
			}

			// 2. Create the new user
			var newUser = new User
			{
				FullName = request.FullName,
				Email = request.Email,
				// Note: In a real production app, ALWAYS hash this password using BCrypt!
				PasswordHash = request.Password,
				Points = 0,
				Role = "Learner"
			};

			// 3. Save to SQL Server
			_context.Users.Add(newUser);
			await _context.SaveChangesAsync();

			return Ok(new { Message = "User registered successfully!" });
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] UserLoginDto request)
		{
			// Find the user in the database
			var user = await _context.Users
				.FirstOrDefaultAsync(u => u.Email == request.Email && u.PasswordHash == request.Password);

			if (user == null)
			{
				return Unauthorized("Invalid email or password.");
			}

			// Return the user data to React (In a fully secure app, you'd return a JWT token here)
			return Ok(new
			{
				Id = user.Id,
				FullName = user.FullName,
				Email = user.Email,
				Role = user.Role
			});
		}
	}

	// DTOs (Data Transfer Objects) define exactly what JSON data we expect from React
	public class UserRegisterDto
	{
		public string FullName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
	}

	public class UserLoginDto
	{
		public string Email { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
	}
}