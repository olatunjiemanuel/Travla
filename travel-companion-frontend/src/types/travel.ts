export interface WeatherSummary {
  isForecast: boolean;
  description: string;
  temperatureMin: number | null;
  temperatureMax: number | null;
  icon: string | null;
  climateContext: string | null;
}

export interface Place {
  name: string;
  description: string;
  category: string;
}

// Named TravelEvent to avoid collision with the browser's global Event type
export interface TravelEvent {
  name: string;
  description: string;
  timing: string;
}

export interface TravelSummaryResponse {
  weather: WeatherSummary;
  places: Place[];
  events: TravelEvent[];
  tips: string[];
}

export interface TravelRequest {
  city: string;
  startDate: string; // ISO format: "yyyy-MM-dd"
  endDate: string;   // ISO format: "yyyy-MM-dd"
}
