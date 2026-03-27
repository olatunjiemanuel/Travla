import type { WeatherSummary } from '../types/travel';

interface WeatherCardProps {
  weather: WeatherSummary;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  if (weather.isForecast) {
    return (
      <div className="weather-card">
        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            width={64}
            height={64}
          />
        )}
        <div>
          <div className="weather-temp">
            {weather.temperatureMin}°C – {weather.temperatureMax}°C
          </div>
          <div className="weather-description">{weather.description}</div>
          <div className="weather-badge">Live forecast</div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-card weather-card--climate">
      <div>
        <div className="weather-label">Typical Climate</div>
        <p className="weather-climate-text">{weather.climateContext}</p>
      </div>
    </div>
  );
}
