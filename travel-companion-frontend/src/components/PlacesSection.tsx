import type { Place } from '../types/travel';

interface PlacesSectionProps {
  places: Place[];
}

export default function PlacesSection({ places }: PlacesSectionProps) {
  return (
    <section className="section">
      <h2 className="section-title">Top Places to See</h2>
      <div className="card-grid">
        {places.map((place, i) => (
          <div key={i} className="card">
            <span className="badge">{place.category}</span>
            <h3 className="card-title">{place.name}</h3>
            <p className="card-text">{place.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
