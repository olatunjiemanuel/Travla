import React from 'react';
import styles from './index.module.css';

interface TipsSectionProps {
  tips: string[];
}

const TipsSection: React.FC<TipsSectionProps> = ({ tips }) => {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Travel Tips</h2>
      <ul className={styles.tipsList}>
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </section>
  );
};

export default TipsSection;
