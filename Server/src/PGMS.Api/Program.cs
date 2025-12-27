using PGMS.Api.Middleware;
using PGMS.Application;
using PGMS.Infrastructure;
using PGMS.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add Infrastructure (Database, JWT, Repositories)
builder.Services.AddInfrastructure(builder.Configuration);

// Add Application (Services, AutoMapper, FluentValidation)
builder.Services.AddApplication();

// CORS - Must specify exact origin when using credentials (http-only cookies)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Add your frontend origins
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Required for http-only cookies (refresh token)
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

// Global exception handling middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created and seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated();
        
        // Seed default data
        await PGMS.Infrastructure.Data.SeedData.SeedRolesAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while creating the database");
    }
}

app.Run();

