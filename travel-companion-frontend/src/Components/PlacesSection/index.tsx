import React from 'react';
import type { Place } from '../../types/travel';
import styles from './index.module.css';

interface PlacesSectionProps {
  places: Place[];
}

const PlacesSection: React.FC<PlacesSectionProps> = ({ places }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Top Places to See</h2>
      <div className={styles.cardGrid}>
        {places.map((place, i) => (
          <div key={i} className={styles.card}>
            <span className={styles.badge}>{place.category}</span>
            <h3 className={styles.cardTitle}>{place.name}</h3>
            <p className={styles.cardText}>{place.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlacesSection;
