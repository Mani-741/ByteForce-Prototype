namespace LearnSphereAI.Api.Models
{
	public class UserCourse
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public int CourseId { get; set; }
		public int ProgressPercentage { get; set; } = 0;
		public string Status { get; set; } = "Pending"; // Pending, In Progress, Completed
		public DateTime LastAccessed { get; set; } = DateTime.UtcNow;
	}
}
