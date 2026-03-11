namespace LearnSphereAI.Api.Models
{
	public class ChatMessage
	{
		public int Id { get; set; }
		public int UserId { get; set; }

		// These are the two new columns
		public string SessionId { get; set; } = string.Empty;
		public string Role { get; set; } = string.Empty;
		public string Content { get; set; } = string.Empty;
		public DateTime Timestamp { get; set; }
	}
}