import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import styles from './App.module.css';
import SearchForm from './Components/SearchForm';
import SkeletonLoader from './Components/SkeletonLoader';
import TravelSummaryView from './Components/TravelSummaryView';
import { fetchTravelSummary } from './services/travelApi';
import type { TravelSummaryResponse } from './types/travel';

type AppState =
  | { view: 'search' }
  | { view: 'loading'; city: string; startDate: string; endDate: string }
  | { view: 'results'; summary: TravelSummaryResponse; city: string; startDate: string; endDate: string }
  | { view: 'error'; message: string };

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({ view: 'search' });

  async function handleSearch(city: string, startDate: string, endDate: string) {
    setState({ view: 'loading', city, startDate, endDate });
    try {
      const summary = await fetchTravelSummary({ city, startDate, endDate });
      setState({ view: 'results', summary, city, startDate, endDate });
    } catch (err) {
      setState({
        view: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      });
    }
  }

  if (state.view === 'loading') {
    return (
      <>
        <SkeletonLoader city={state.city} />
        <Analytics />
      </>
    );
  }

  if (state.view === 'results') {
    return (
      <>
        <TravelSummaryView
          summary={state.summary}
          city={state.city}
          startDate={state.startDate}
          endDate={state.endDate}
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
      <SearchForm onSubmit={handleSearch} />
      <Analytics />
    </>
  );
};

export default App;
