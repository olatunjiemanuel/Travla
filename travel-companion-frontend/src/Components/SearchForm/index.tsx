import React, { useState } from 'react';
import styles from './index.module.css';

interface SearchFormProps {
  onSubmit: (city: string, startDate: string, endDate: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [validationError, setValidationError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError('');

    if (!city.trim()) {
      setValidationError('Please enter a destination city.');
      return;
    }
    if (!startDate) {
      setValidationError('Please select a departure date.');
      return;
    }
    if (!endDate) {
      setValidationError('Please select a return date.');
      return;
    }
    if (endDate < startDate) {
      setValidationError('Return date must be on or after the departure date.');
      return;
    }

    onSubmit(city.trim(), startDate, endDate);
  }

  return (
    <div className={styles.searchPage}>
      <h1 className={styles.appTitle}>Travla</h1>
      <p className={styles.appSubtitle}>Enter a destination and travel dates to get your travel snapshot.</p>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="city">Destination city</label>
          <input
            id="city"
            type="text"
            placeholder="e.g. Tokyo, Paris, New York"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoFocus
          />
        </div>
        <div className={styles.dateRangeGroup}>
          <div className={styles.formGroup}>
            <label htmlFor="startDate">Departure date</label>
            <input
              id="startDate"
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (endDate && endDate < e.target.value) setEndDate('');
              }}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endDate">Return date</label>
            <input
              id="endDate"
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        {validationError && <div className={styles.errorBox}>{validationError}</div>}
        <button type="submit" className={styles.submitBtn}>
          Get travel snapshot
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
