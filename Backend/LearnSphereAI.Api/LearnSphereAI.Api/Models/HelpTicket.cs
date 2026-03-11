namespace LearnSphereAI.Api.Models
{
	public class HelpTicket
	{
		public int Id { get; set; }
		public string Category { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public int UserId { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	}
}