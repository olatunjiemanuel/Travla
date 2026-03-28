import React from 'react';
import type { TravelEvent } from '../../types/travel';
import styles from './index.module.css';

interface EventsSectionProps {
  events: TravelEvent[];
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Local Events &amp; Culture</h2>
      <div className={styles.cardGrid}>
        {events.map((event, i) => (
          <div key={i} className={styles.card}>
            <span className={`${styles.badge} ${styles.badgeEvent}`}>{event.timing}</span>
            <h3 className={styles.cardTitle}>{event.name}</h3>
            <p className={styles.cardText}>{event.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventsSection;
