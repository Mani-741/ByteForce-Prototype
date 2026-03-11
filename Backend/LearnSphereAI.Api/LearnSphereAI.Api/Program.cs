using LearnSphereAI.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add Database
builder.Services.AddDbContext<AppDbContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure CORS to allow your React app
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowReactApp",
		policy =>
		{
			policy.WithOrigins("http://localhost:5173")
				  .AllowAnyHeader()
				  .AllowAnyMethod()
				  .AllowCredentials();
		});
});

// Allows our AiController to make API calls to Google Gemini
builder.Services.AddHttpClient();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Tell the app to use the CORS policy we just made
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();

app.Run();