using LearnSphereAI.Api.Data;
using LearnSphereAI.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearnSphereAI.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CoursesController : ControllerBase
	{
		private readonly AppDbContext _context;

		public CoursesController(AppDbContext context)
		{
			_context = context;
		}

		// 1. GET: Fetch all courses
		[HttpGet]
		public async Task<IActionResult> GetAllCourses()
		{
			return Ok(await _context.Courses.ToListAsync());
		}

		// 2. POST: Add a new course to the catalog
		[HttpPost]
		public async Task<IActionResult> AddCourse([FromBody] Course course)
		{
			if (course == null) return BadRequest();

			_context.Courses.Add(course);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetAllCourses), new { id = course.Id }, course);
		}

		// 3. POST: Enroll a user in a course
		[HttpPost("enroll")]
		public async Task<IActionResult> EnrollInCourse([FromBody] EnrollRequestDto request)
		{
			var alreadyEnrolled = await _context.UserCourses
				.AnyAsync(uc => uc.UserId == request.UserId && uc.CourseId == request.CourseId);

			if (alreadyEnrolled)
			{
				return BadRequest("You are already enrolled in this course.");
			}

			var newEnrollment = new UserCourse
			{
				UserId = request.UserId,
				CourseId = request.CourseId,
				ProgressPercentage = 0,
				Status = "In Progress", // Default status
				LastAccessed = DateTime.UtcNow
			};

			_context.UserCourses.Add(newEnrollment);
			await _context.SaveChangesAsync();

			return Ok(new { Message = "Successfully enrolled!" });
		}

		// 1. UPDATE THIS METHOD: Fetch user's courses using the new fields
		[HttpGet("user/{userId}")]
		public async Task<IActionResult> GetUserCourses(int userId)
		{
			var enrolledCourses = await _context.UserCourses
				.Where(uc => uc.UserId == userId)
				.Join(_context.Courses,
					  uc => uc.CourseId,
					  c => c.Id,
					  (uc, c) => new
					  {
						  Id = c.Id, // Passed to React as the course ID
						  CourseId = c.Id,
						  c.Title,
						  c.Description,
						  c.TotalModules,
						  uc.ProgressPercentage, // <-- Using your new field
						  uc.Status              // <-- Using your new field
					  })
				.ToListAsync();

			return Ok(enrolledCourses);
		}

		// 2. UPDATE THIS METHOD: Increment the ProgressPercentage directly
		[HttpPost("progress")]
		public async Task<IActionResult> UpdateProgress([FromBody] ProgressRequestDto request)
		{
			var userCourse = await _context.UserCourses
				.FirstOrDefaultAsync(uc => uc.UserId == request.UserId && uc.CourseId == request.CourseId);

			if (userCourse == null) return NotFound("You are not enrolled in this course.");

			var course = await _context.Courses.FindAsync(request.CourseId);
			if (course == null) return NotFound("Course not found.");

			// Calculate how much 1 module is worth (e.g., 100 / 4 modules = 25% per click)
			int percentPerModule = (int)Math.Round(100.0 / course.TotalModules);

			// Add it to their total progress
			userCourse.ProgressPercentage += percentPerModule;

			// Cap it at 100 and update the Status
			if (userCourse.ProgressPercentage >= 100)
			{
				userCourse.ProgressPercentage = 100;
				userCourse.Status = "Completed";
			}
			else
			{
				userCourse.Status = "In Progress";
			}

			userCourse.LastAccessed = DateTime.UtcNow;
			await _context.SaveChangesAsync();

			return Ok(new
			{
				Message = "Progress updated!",
				Progress = userCourse.ProgressPercentage,
				Status = userCourse.Status
			});
		}

		// Add this DTO at the bottom of your file next to EnrollRequestDto
		public class ProgressRequestDto
		{
			public int UserId { get; set; }
			public int CourseId { get; set; }
		}
	}

	public class EnrollRequestDto
	{
		public int UserId { get; set; }
		public int CourseId { get; set; }
	}
}