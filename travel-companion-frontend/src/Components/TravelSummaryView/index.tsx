import React from 'react';
import type { TravelSummaryResponse } from '../../types/travel';
import WeatherCard from '../WeatherCard';
import PlacesSection from '../PlacesSection';
import EventsSection from '../EventsSection';
import TipsSection from '../TipsSection';
import styles from './index.module.css';

interface TravelSummaryViewProps {
  summary: TravelSummaryResponse;
  city: string;
  travelDate: string;
  onReset: () => void;
}

const TravelSummaryView: React.FC<TravelSummaryViewProps> = ({
  summary,
  city,
  travelDate,
  onReset,
}) => {
  const formattedDate = new Date(travelDate + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.summaryView}>
      <div className={styles.summaryHeader}>
        <div>
          <h1 className={styles.summaryTitle}>{city}</h1>
          <p className={styles.summaryDate}>{formattedDate}</p>
        </div>
        <button className={styles.btnSecondary} onClick={onReset}>
          ← Search again
        </button>
      </div>

      <WeatherCard weather={summary.weather} />
      <PlacesSection places={summary.places} />
      <EventsSection events={summary.events} />
      <TipsSection tips={summary.tips} />
    </div>
  );
};

export default TravelSummaryView;
