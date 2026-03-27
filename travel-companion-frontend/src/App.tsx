import { useState } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import TravelSummaryView from './components/TravelSummaryView';
import { fetchTravelSummary } from './services/travelApi';
import type { TravelSummaryResponse } from './types/travel';

type AppState =
  | { view: 'search' }
  | { view: 'loading'; city: string; travelDate: string }
  | { view: 'results'; summary: TravelSummaryResponse; city: string; travelDate: string }
  | { view: 'error'; message: string };

export default function App() {
  const [state, setState] = useState<AppState>({ view: 'search' });

  async function handleSearch(city: string, travelDate: string) {
    setState({ view: 'loading', city, travelDate });
    try {
      const summary = await fetchTravelSummary({ city, travelDate });
      setState({ view: 'results', summary, city, travelDate });
    } catch (err) {
      setState({
        view: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      });
    }
  }

  if (state.view === 'results') {
    return (
      <TravelSummaryView
        summary={state.summary}
        city={state.city}
        travelDate={state.travelDate}
        onReset={() => setState({ view: 'search' })}
      />
    );
  }

  if (state.view === 'error') {
    return (
      <div className="search-page">
        <h1 className="app-title">Travla</h1>
        <div className="error-box">{state.message}</div>
        <button
          className="btn-secondary"
          style={{ marginTop: '1rem' }}
          onClick={() => setState({ view: 'search' })}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <SearchForm
      onSubmit={handleSearch}
      isLoading={state.view === 'loading'}
    />
  );
}
