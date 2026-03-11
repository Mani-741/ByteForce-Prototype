using LearnSphereAI.Api.Data;
using LearnSphereAI.Api.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace LearnSphereAI.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AiController : ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly string _apiKey;
		private readonly HttpClient _httpClient;

		public AiController(AppDbContext context, IConfiguration configuration, HttpClient httpClient)
		{
			_context = context;
			_apiKey = configuration["GeminiApiKey"] ?? "";
			_httpClient = httpClient;
		}

		// 1. GET ALL SESSIONS FOR THE SIDEBAR (FIXED!)
		[HttpGet("sessions/{userId}")]
		public async Task<IActionResult> GetUserSessions(int userId)
		{
			try
			{
				// STEP A: Fetch the messages into memory FIRST to prevent EF Core translation crashes
				var allUserMessages = await _context.ChatMessages
					.Where(m => m.UserId == userId && m.Role == "user")
					.ToListAsync();

				// STEP B: Group them safely in standard C# memory
				var sessions = allUserMessages
					.GroupBy(m => m.SessionId)
					// Ensure we don't accidentally grab a blank SessionId from old legacy messages
					.Where(g => !string.IsNullOrEmpty(g.Key))
					.Select(g => new
					{
						sessionId = g.Key,
						// The first question they asked becomes the title
						title = g.OrderBy(m => m.Timestamp).First().Content,
						lastUpdated = g.Max(m => m.Timestamp)
					})
					.OrderByDescending(s => s.lastUpdated)
					.ToList();

				return Ok(sessions);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Error loading sessions: {ex.Message}");
			}
		}

		// 2. GET HISTORY FOR A SPECIFIC SESSION
		[HttpGet("history/{sessionId}")]
		public async Task<IActionResult> GetSessionHistory(string sessionId)
		{
			var messages = await _context.ChatMessages
				.Where(m => m.SessionId == sessionId)
				.OrderBy(m => m.Timestamp)
				.Select(m => new { role = m.Role, text = m.Content })
				.ToListAsync();

			return Ok(messages);
		}

		// 3. SEND A CHAT MESSAGE (Updated to use SessionId)
		[HttpPost("chat")]
		public async Task<IActionResult> Chat([FromBody] ChatRequestDto request)
		{
			if (string.IsNullOrEmpty(request.Message)) return BadRequest("Message is empty.");

			// Create a new session ID if the frontend didn't send one
			var activeSessionId = string.IsNullOrEmpty(request.SessionId) ? Guid.NewGuid().ToString() : request.SessionId;

			var courses = await _context.Courses.ToListAsync();
			string curriculumContext = string.Join("\n", courses.Select(c => $"- {c.Title}: {c.Description}"));

			var userMsg = new ChatMessage
			{
				UserId = request.UserId,
				SessionId = activeSessionId, // Save the SessionId
				Role = "user",
				Content = request.Message,
				Timestamp = DateTime.UtcNow
			};
			_context.ChatMessages.Add(userMsg);
			await _context.SaveChangesAsync();

			try
			{
				var apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={_apiKey}";
				//var payload = new
				//{
				//	contents = new[] {
				//		new { parts = new[] { new { text = $"System: You are a LearnSphere assistant. Answer ONLY based on the following curriculum:\n{curriculumContext}\n\nUser Question: {request.Message}" } } }
				//	}
				//};

				// Temporarily comment out the curriculum context for testing
				var payload = new
				{
					contents = new[] {
        // We removed the massive curriculumContext variable here!
        new { parts = new[] { new { text = $"System: You are a helpful LearnSphere assistant.\n\nUser Question: {request.Message}" } } }
	}
				};



				var httpContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
				var response = await _httpClient.PostAsync(apiUrl, httpContent);

				var responseBody = await response.Content.ReadAsStringAsync();


				if (!response.IsSuccessStatusCode)
				{
					// This will pass Google's EXACT error message to your React frontend
					return StatusCode((int)response.StatusCode, $"Gemini Error: {responseBody}");
				}

				using var doc = JsonDocument.Parse(responseBody);
				string aiText = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString() ?? "Error";

				var aiMsg = new ChatMessage
				{
					UserId = request.UserId,
					SessionId = activeSessionId, // Save the SessionId for the AI too
					Role = "assistant",
					Content = aiText,
					Timestamp = DateTime.UtcNow
				};
				_context.ChatMessages.Add(aiMsg);
				await _context.SaveChangesAsync();

				// Return both the text and the sessionId so React knows which session we are in
				return Ok(new { role = "assistant", text = aiText, sessionId = activeSessionId });
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal Error: {ex.Message}");
			}
		}
	}

	public class ChatRequestDto
	{
		public int UserId { get; set; }
		public string SessionId { get; set; } = string.Empty; // Added this
		public string Message { get; set; } = string.Empty;
	}
}