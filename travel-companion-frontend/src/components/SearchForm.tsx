import { useState } from 'react';

interface SearchFormProps {
  onSubmit: (city: string, travelDate: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
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
    <div className="search-page">
      <h1 className="app-title">Travla</h1>
      <p className="app-subtitle">Enter a destination and date to get your travel snapshot.</p>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="city">Destination city</label>
          <input
            id="city"
            type="text"
            placeholder="e.g. Tokyo, Paris, New York"
            value={city}
            onChange={e => setCity(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label htmlFor="travelDate">Travel date</label>
          <input
            id="travelDate"
            type="date"
            min={today}
            value={travelDate}
            onChange={e => setTravelDate(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {validationError && (
          <div className="error-box">{validationError}</div>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching…' : 'Get travel snapshot'}
        </button>
      </form>
    </div>
  );
}
