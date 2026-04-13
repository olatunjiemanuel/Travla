using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.RateLimiting;
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

// Rate limiting — 10 requests per minute per IP to guard pay-per-use APIs
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("summary", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                Window = TimeSpan.FromMinutes(1),
                PermitLimit = 10,
                QueueLimit = 0,
                AutoReplenishment = true
            }
        )
    );
    options.RejectionStatusCode = 429;
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        await context.HttpContext.Response.WriteAsJsonAsync(
            new { error = "Too many requests. Please wait a moment before trying again." }, token);
    };
});

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");
app.UseRateLimiter();
app.UseHttpsRedirection();

app.MapPost("/api/travel/summary", async (TravelRequest request, TravelSummaryService summaryService, ILogger<Program> logger) =>
{
    if (string.IsNullOrWhiteSpace(request.City))
        return Results.BadRequest(new { error = "City is required." });

    // Allow Unicode letters, spaces, hyphens, apostrophes, commas, and periods —
    // the full range of real city/region names (e.g. "São Paulo", "Clermont-Ferrand", "Xi'an").
    // Newlines, control chars, and injection payloads are rejected here before reaching the AI.
    var trimmedCity = request.City.Trim();
    if (trimmedCity.Length > 100 || !Regex.IsMatch(trimmedCity, @"^[\p{L}\s\-'',\.]+$"))
        return Results.BadRequest(new { error = "Please enter a valid city name." });

    if (!DateOnly.TryParse(request.StartDate, out var startDate))
        return Results.BadRequest(new { error = "StartDate must be a valid date (yyyy-MM-dd)." });

    if (!DateOnly.TryParse(request.EndDate, out var endDate))
        return Results.BadRequest(new { error = "EndDate must be a valid date (yyyy-MM-dd)." });

    if (endDate < startDate)
        return Results.BadRequest(new { error = "EndDate must be on or after StartDate." });

    try
    {
        var result = await summaryService.GetSummaryAsync(trimmedCity, startDate, endDate);
        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to get travel summary for {City} from {Start} to {End}", trimmedCity, startDate, endDate);
        return Results.Json(new { error = "Something went wrong. Please try again." }, statusCode: 500);
    }
}).RequireRateLimiting("summary");

app.Run();
