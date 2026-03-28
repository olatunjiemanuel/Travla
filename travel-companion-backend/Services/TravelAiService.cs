using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using travel_companion_backend.Models;

namespace travel_companion_backend.Services;

public class TravelAiService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
{
    private readonly string _apiKey = configuration["Claude:ApiKey"] ?? "";
    private readonly string _baseUrl = configuration["Claude:BaseUrl"]
        ?? "https://api.anthropic.com/v1/messages";
    private readonly string _model = configuration["Claude:Model"]
        ?? "claude-haiku-4-5-20251001";

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<AiTravelData> GetTravelDataAsync(
        string city,
        DateOnly travelDate,
        bool includeClimateContext)
    {
        var month = travelDate.ToString("MMMM");
        var formattedDate = travelDate.ToString("MMMM d, yyyy");

        var climateInstructions = includeClimateContext
            ? $"Describe the typical weather and climate for {city} in {month}. Be concise (2-3 sentences)."
            : "Set this to null.";

        var userMessage = $$"""
            I am travelling to {{city}} on {{formattedDate}}.

            Return a JSON object with exactly these keys:
            {
              "places": [
                { "name": "string", "description": "string (1-2 sentences)", "category": "string (e.g. Landmark, Museum, Nature, Food)" }
              ],
              "events": [
                { "name": "string", "description": "string (1-2 sentences)", "timing": "string (e.g. Ongoing, Seasonal, Annual in {{month}})" }
              ],
              "tips": ["string", "string"],
              "climateContext": "string or null"
            }

            Rules:
            - "places": return 5 top attractions or landmarks worth visiting.
            - "events": return 3-5 local events, festivals, or cultural highlights relevant to that time of year.
            - "tips": return 5-7 practical travel tips covering what to pack, local customs, transport, and recommended neighbourhoods.
            - "climateContext": {{climateInstructions}}
            """;

        var requestBody = new
        {
            model = _model,
            max_tokens = 1500,
            system = "You are a travel expert assistant. You always respond with valid JSON only — no markdown, no explanation, no code fences. Your JSON must exactly match the schema the user provides.",
            messages = new[]
            {
                new { role = "user", content = userMessage }
            }
        };

        var client = httpClientFactory.CreateClient("claude");
        var request = new HttpRequestMessage(HttpMethod.Post, _baseUrl);
        request.Headers.Add("x-api-key", _apiKey);
        request.Headers.Add("anthropic-version", "2023-06-01");
        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        var response = await client.SendAsync(request);
        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"Claude API error {response.StatusCode}: {responseJson}");

        var claudeResponse = JsonSerializer.Deserialize<ClaudeResponse>(responseJson, _jsonOptions)
            ?? throw new InvalidOperationException("Failed to deserialise Claude response.");

        var rawText = claudeResponse.Content.FirstOrDefault(c => c.Type == "text")?.Text
            ?? throw new InvalidOperationException("Claude returned no text content.");

        // Strip markdown code fences if Claude wraps the JSON despite instructions
        var text = rawText.Trim();
        if (text.StartsWith("```"))
        {
            var firstNewline = text.IndexOf('\n');
            var lastFence = text.LastIndexOf("```");
            if (firstNewline >= 0 && lastFence > firstNewline)
                text = text[(firstNewline + 1)..lastFence].Trim();
        }

        var data = JsonSerializer.Deserialize<AiTravelData>(text, _jsonOptions)
            ?? throw new InvalidOperationException("Failed to deserialise Claude travel data.");

        return data;
    }

    // Internal Claude API DTOs
    private record ClaudeResponse(List<ClaudeContentBlock> Content);
    private record ClaudeContentBlock(string Type, string Text);
}

public record AiTravelData(
    List<Place> Places,
    List<TravelEvent> Events,
    List<string> Tips,
    string? ClimateContext
);
