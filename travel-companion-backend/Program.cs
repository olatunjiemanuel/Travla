using System.Text.Json;
using travel_companion_backend.Models;
using travel_companion_backend.Services;

var builder = WebApplication.CreateBuilder(args);

// CORS – allow frontend origins
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Named HTTP clients
builder.Services.AddHttpClient("owm");
builder.Services.AddHttpClient("claude");

// Application services
builder.Services.AddSingleton<WeatherService>();
builder.Services.AddSingleton<TravelAiService>();
builder.Services.AddSingleton<TravelSummaryService>();

// Camel-case JSON so C# records serialise to camelCase for the frontend
builder.Services.ConfigureHttpJsonOptions(opts =>
{
    opts.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");
app.UseHttpsRedirection();

app.MapPost("/api/travel/summary", async (TravelRequest request, TravelSummaryService summaryService, ILogger<Program> logger) =>
{
    if (string.IsNullOrWhiteSpace(request.City))
        return Results.BadRequest(new { error = "City is required." });

    if (!DateOnly.TryParse(request.StartDate, out var startDate))
        return Results.BadRequest(new { error = "StartDate must be a valid date (yyyy-MM-dd)." });

    if (!DateOnly.TryParse(request.EndDate, out var endDate))
        return Results.BadRequest(new { error = "EndDate must be a valid date (yyyy-MM-dd)." });

    if (endDate < startDate)
        return Results.BadRequest(new { error = "EndDate must be on or after StartDate." });

    try
    {
        var result = await summaryService.GetSummaryAsync(request.City.Trim(), startDate, endDate);
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to get travel summary for {City} from {Start} to {End}", request.City, startDate, endDate);
        return Results.Json(new { error = "Something went wrong. Please try again." }, statusCode: 500);
    }
});

app.Run();
