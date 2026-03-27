import type { TravelSummaryResponse } from '../types/travel';
import WeatherCard from './WeatherCard';
import PlacesSection from './PlacesSection';
import EventsSection from './EventsSection';
import TipsSection from './TipsSection';

interface TravelSummaryViewProps {
  summary: TravelSummaryResponse;
  city: string;
  travelDate: string;
  onReset: () => void;
}

export default function TravelSummaryView({
  summary,
  city,
  travelDate,
  onReset,
}: TravelSummaryViewProps) {
  const formattedDate = new Date(travelDate + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="summary-view">
      <div className="summary-header">
        <div>
          <h1 className="summary-title">
            {city}
          </h1>
          <p className="summary-date">{formattedDate}</p>
        </div>
        <button className="btn-secondary" onClick={onReset}>
          ← Search again
        </button>
      </div>

      <WeatherCard weather={summary.weather} />
      <PlacesSection places={summary.places} />
      <EventsSection events={summary.events} />
      <TipsSection tips={summary.tips} />
    </div>
  );
}
