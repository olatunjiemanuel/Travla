import React from 'react';
import type { WeatherSummary } from '../../types/travel';
import styles from './index.module.css';

interface WeatherCardProps {
  weather: WeatherSummary;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  if (weather.isForecast) {
    return (
      <div className={styles.weatherCard}>
        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            width={64}
            height={64}
          />
        )}
        <div>
          <div className={styles.weatherTemp}>
            {weather.temperatureMin}°C – {weather.temperatureMax}°C
          </div>
          <div className={styles.weatherDescription}>{weather.description}</div>
          <div className={styles.weatherBadge}>Live forecast</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.weatherCard} ${styles.weatherCardClimate}`}>
      <div>
        <div className={styles.weatherLabel}>Typical Climate</div>
        <p className={styles.weatherClimateText}>{weather.climateContext}</p>
      </div>
    </div>
  );
};

export default WeatherCard;
