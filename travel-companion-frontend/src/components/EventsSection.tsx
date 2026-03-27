import type { TravelEvent } from '../types/travel';

interface EventsSectionProps {
  events: TravelEvent[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  return (
    <section className="section">
      <h2 className="section-title">Local Events &amp; Culture</h2>
      <div className="card-grid">
        {events.map((event, i) => (
          <div key={i} className="card">
            <span className="badge badge--event">{event.timing}</span>
            <h3 className="card-title">{event.name}</h3>
            <p className="card-text">{event.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
