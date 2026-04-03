using travel_companion_backend.Models;

namespace travel_companion_backend.Services;

public class TravelSummaryService(WeatherService weatherService, TravelAiService travelAiService)
{
    public async Task<TravelSummaryResponse> GetSummaryAsync(string city, DateOnly travelDate)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var daysOut = travelDate.DayNumber - today.DayNumber;
        var includeClimateContext = daysOut > 5;

        // Run both calls in parallel to minimise latency
        var weatherTask = weatherService.GetWeatherAsync(city, travelDate);
        var aiTask = travelAiService.GetTravelDataAsync(city, travelDate, includeClimateContext);

        await Task.WhenAll(weatherTask, aiTask);

        var weatherResult = await weatherTask;
        var aiData = await aiTask;

        WeatherSummary weather;
        if (weatherResult is not null)
        {
            weather = weatherResult;
        }
        else
        {
            var context = aiData.ClimateContext ?? "No climate information available.";
            weather = new WeatherSummary(
                IsForecast: false,
                Description: context,
                TemperatureMin: null,
                TemperatureMax: null,
                Icon: null,
                ClimateContext: context
            );
        }

        return new TravelSummaryResponse(
            Weather: weather,
            Places: aiData.Places,
            Events: aiData.Events,
            Tips: aiData.Tips
        );
    }
}
