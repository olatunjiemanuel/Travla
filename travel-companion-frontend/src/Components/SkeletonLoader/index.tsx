import React from 'react';
import styles from './index.module.css';

interface SkeletonLoaderProps {
  city: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ city }) => {
  return (
    <div className={styles.skeletonView}>
      {/* Header */}
      <div className={styles.skeletonHeader}>
        <div>
          <div className={`${styles.bone} ${styles.boneTitle}`} aria-label={`Loading results for ${city}`} />
          <div className={`${styles.bone} ${styles.boneSubtitle}`} />
        </div>
        <div className={`${styles.bone} ${styles.boneBtn}`} />
      </div>

      {/* Weather card */}
      <div className={styles.skeletonCard}>
        <div className={`${styles.bone} ${styles.boneIcon}`} />
        <div className={styles.skeletonCardBody}>
          <div className={`${styles.bone} ${styles.boneTemp}`} />
          <div className={`${styles.bone} ${styles.boneText}`} />
          <div className={`${styles.bone} ${styles.boneBadge}`} />
        </div>
      </div>

      {/* Places section */}
      <div className={styles.skeletonSection}>
        <div className={`${styles.bone} ${styles.boneSectionHeading}`} />
        <div className={styles.skeletonGrid}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.skeletonItemCard}>
              <div className={`${styles.bone} ${styles.boneItemTitle}`} />
              <div className={`${styles.bone} ${styles.boneItemText}`} />
              <div className={`${styles.bone} ${styles.boneItemTextShort}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Events section */}
      <div className={styles.skeletonSection}>
        <div className={`${styles.bone} ${styles.boneSectionHeading}`} />
        <div className={styles.skeletonGrid}>
          {[0, 1].map((i) => (
            <div key={i} className={styles.skeletonItemCard}>
              <div className={`${styles.bone} ${styles.boneItemTitle}`} />
              <div className={`${styles.bone} ${styles.boneItemText}`} />
              <div className={`${styles.bone} ${styles.boneItemTextShort}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Tips section */}
      <div className={styles.skeletonSection}>
        <div className={`${styles.bone} ${styles.boneSectionHeading}`} />
        <div className={styles.skeletonTips}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`${styles.bone} ${styles.boneTipLine}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
