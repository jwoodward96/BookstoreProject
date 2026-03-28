using Bookstore.API.Data;
using Microsoft.EntityFrameworkCore;

// Create the application builder and configure all services before building the app.
var builder = WebApplication.CreateBuilder(args);

// Register controllers so the app can route HTTP requests to controller classes.
builder.Services.AddControllers();

// Configure CORS to allow the React frontend (on a different port) to call this API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Register the EF Core DbContext using the SQLite connection string from appsettings.json.
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// Add OpenAPI (Swagger) support for auto-generated API documentation.
builder.Services.AddOpenApi();

var app = builder.Build();

// Apply the CORS policy so cross-origin requests from the frontend are accepted.
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    // Only expose the OpenAPI endpoint in development, not in production.
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
