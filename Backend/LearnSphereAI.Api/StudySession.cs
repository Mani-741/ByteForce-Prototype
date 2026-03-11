namespace LearnSphereAI.Api.Models
{
	public class StudySession
	{
		public int Id { get; set; }
		public int UserId { get; set; }
		public DateTime SessionDate { get; set; } = DateTime.UtcNow;
		public double DurationInHours { get; set; }
	}
}