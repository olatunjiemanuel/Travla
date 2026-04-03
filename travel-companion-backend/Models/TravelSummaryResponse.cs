namespace travel_companion_backend.Models;

public record TravelSummaryResponse(
    WeatherSummary Weather,
    List<Place> Places,
    List<TravelEvent> Events,
    List<string> Tips
);

public record WeatherSummary(
    bool IsForecast,
    string Description,
    double? TemperatureMin,
    double? TemperatureMax,
    string? Icon,
    string? ClimateContext
);

public record Place(string Name, string Description, string Category);

public record TravelEvent(string Name, string Description, string Timing);
