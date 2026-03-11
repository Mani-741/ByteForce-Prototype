using LearnSphereAI.Api.Data;
using LearnSphereAI.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace LearnSphereAI.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class HelpDeskController : ControllerBase
	{
		private readonly AppDbContext _context;

		public HelpDeskController(AppDbContext context)
		{
			_context = context;
		}

		[HttpPost("submit")]
		public async Task<IActionResult> SubmitTicket([FromBody] HelpTicketRequestDto request)
		{
			// Create a new ticket object mapped to your SQL table
			var newTicket = new HelpTicket
			{
				UserId = request.UserId,
				Category = request.Category,
				Description = request.Description,
				CreatedAt = DateTime.UtcNow
			};

			// Save it to the database
			_context.HelpTickets.Add(newTicket);
			await _context.SaveChangesAsync();

			return Ok(new { Message = "Ticket submitted successfully!" });
		}
	}

	// This DTO defines the JSON structure we expect from React
	public class HelpTicketRequestDto
	{
		public int UserId { get; set; }
		public string Category { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
	}
}