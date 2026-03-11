using LearnSphere.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LearnSphereAI.Api.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		// Core User & Support
		public DbSet<User> Users { get; set; }
		public DbSet<HelpTicket> HelpTickets { get; set; }

		// Curriculum & Progress
		public DbSet<Course> Courses { get; set; }
		public DbSet<UserCourse> UserCourses { get; set; }

		// Dashboard Stats
		public DbSet<StudySession> StudySessions { get; set; }

		// AI Chat History
		public DbSet<ChatMessage> ChatMessages { get; set; }
	}
}