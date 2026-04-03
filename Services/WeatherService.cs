using System.Text.Json;
using System.Text.Json.Serialization;
using travel_companion_backend.Models;

namespace travel_companion_backend.Services;

public class WeatherService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
{
    private readonly string _apiKey = configuration["OpenWeatherMap:ApiKey"] ?? "";
    private readonly string _forecastUrl = configuration["OpenWeatherMap:ForecastUrl"]
        ?? "https://api.openweathermap.org/data/2.5/forecast";

    public async Task<WeatherSummary?> GetWeatherAsync(string city, DateOnly travelDate)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var daysOut = travelDate.DayNumber - today.DayNumber;

        if (daysOut > 5)
            return null;

        var client = httpClientFactory.CreateClient("owm");
        var url = $"{_forecastUrl}?q={Uri.EscapeDataString(city)}&appid={_apiKey}&units=metric";

        var response = await client.GetAsync(url);
        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync();
        var forecast = JsonSerializer.Deserialize<OWMForecastResponse>(json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (forecast?.List is null || forecast.List.Count == 0)
            return null;

        var datePrefix = travelDate.ToString("yyyy-MM-dd");
        var daySlots = forecast.List
            .Where(s => s.DtTxt.StartsWith(datePrefix))
            .ToList();

        if (daySlots.Count == 0)
            return null;

        var tempMin = daySlots.Min(s => s.Main.TempMin);
        var tempMax = daySlots.Max(s => s.Main.TempMax);

        // Prefer noon slot for description/icon, fall back to first available
        var representativeSlot = daySlots.FirstOrDefault(s => s.DtTxt.Contains("12:00:00"))
            ?? daySlots[0];

        var weather = representativeSlot.Weather.FirstOrDefault();
        var description = weather?.Description ?? "N/A";
        var icon = weather?.Icon;

        return new WeatherSummary(
            IsForecast: true,
            Description: char.ToUpper(description[0]) + description[1..],
            TemperatureMin: Math.Round(tempMin, 1),
            TemperatureMax: Math.Round(tempMax, 1),
            Icon: icon,
            ClimateContext: null
        );
    }

    // Internal OWM DTOs
    private record OWMForecastResponse(List<OWMSlot> List);

    private record OWMSlot(
        [property: JsonPropertyName("dt_txt")] string DtTxt,
        OWMMain Main,
        List<OWMWeather> Weather
    );

    private record OWMMain(
        [property: JsonPropertyName("temp_min")] double TempMin,
        [property: JsonPropertyName("temp_max")] double TempMax
    );

    private record OWMWeather(string Description, string Icon);
}
