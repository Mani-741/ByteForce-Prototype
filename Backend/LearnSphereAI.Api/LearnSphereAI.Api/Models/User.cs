namespace LearnSphereAI.Api.Models
{
	public class User
	{
		public int Id { get; set; }
		public string FullName { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string PasswordHash { get; set; } = string.Empty;
		public int Points { get; set; } = 0; // For Leaderboard
		public string Role { get; set; } = "Learner";
	}
}