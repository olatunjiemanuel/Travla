import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import styles from './App.module.css';
import SearchForm from './Components/SearchForm';
import TravelSummaryView from './Components/TravelSummaryView';
import { fetchTravelSummary } from './services/travelApi';
import type { TravelSummaryResponse } from './types/travel';

type AppState =
  | { view: 'search' }
  | { view: 'loading'; city: string; travelDate: string }
  | { view: 'results'; summary: TravelSummaryResponse; city: string; travelDate: string }
  | { view: 'error'; message: string };

const App: React.FC = () => {
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
      <>
        <TravelSummaryView
          summary={state.summary}
          city={state.city}
          travelDate={state.travelDate}
          onReset={() => setState({ view: 'search' })}
        />
        <Analytics />
      </>
    );
  }

  if (state.view === 'error') {
    return (
      <>
        <div className={styles.searchPage}>
          <h1 className={styles.appTitle}>Travla</h1>
          <div className={styles.errorBox}>{state.message}</div>
          <button className={styles.btnSecondary} onClick={() => setState({ view: 'search' })}>
            Try again
          </button>
        </div>
        <Analytics />
      </>
    );
  }

  return (
    <>
      <SearchForm onSubmit={handleSearch} isLoading={state.view === 'loading'} />
      <Analytics />
    </>
  );
};

export default App;