import React, { useState } from 'react';
import styles from './index.module.css';

interface SearchFormProps {
  onSubmit: (city: string, travelDate: string) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, isLoading }) => {
  const [city, setCity] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [validationError, setValidationError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError('');

    if (!city.trim()) {
      setValidationError('Please enter a destination city.');
      return;
    }
    if (!travelDate) {
      setValidationError('Please select a travel date.');
      return;
    }

    onSubmit(city.trim(), travelDate);
  }

  return (
    <div className={styles.searchPage}>
      <h1 className={styles.appTitle}>Travla</h1>
      <p className={styles.appSubtitle}>Enter a destination and date to get your travel snapshot.</p>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="city">Destination city</label>
          <input
            id="city"
            type="text"
            placeholder="e.g. Tokyo, Paris, New York"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="travelDate">Travel date</label>
          <input
            id="travelDate"
            type="date"
            min={today}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {validationError && <div className={styles.errorBox}>{validationError}</div>}
        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
          {isLoading ? 'Searching…' : 'Get travel snapshot'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
