using System.Text.Json;
using travel_companion_backend.Models;
using travel_companion_backend.Services;

var builder = WebApplication.CreateBuilder(args);

// CORS – allow frontend dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
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

    if (!DateOnly.TryParse(request.TravelDate, out var travelDate))
        return Results.BadRequest(new { error = "TravelDate must be a valid date (yyyy-MM-dd)." });

    try
    {
        var result = await summaryService.GetSummaryAsync(request.City.Trim(), travelDate);
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to get travel summary for {City} on {Date}", request.City, travelDate);
        return Results.Json(new { error = "Something went wrong. Please try again." }, statusCode: 500);
    }
});

app.Run();
