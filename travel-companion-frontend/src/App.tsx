import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import styles from './App.module.css';
import InteractiveBackground from './Components/InteractiveBackground';
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

  const renderContent = () => {
    if (state.view === 'loading') {
      return <SkeletonLoader city={state.city} />;
    }

    if (state.view === 'results') {
      return (
        <TravelSummaryView
          summary={state.summary}
          city={state.city}
          startDate={state.startDate}
          endDate={state.endDate}
          onReset={() => setState({ view: 'search' })}
        />
      );
    }

    if (state.view === 'error') {
      return (
        <div className={styles.searchPage}>
          <h1 className={styles.appTitle}>Travla</h1>
          <div className={styles.errorBox}>{state.message}</div>
          <button className={styles.btnSecondary} onClick={() => setState({ view: 'search' })}>
            Try again
          </button>
        </div>
      );
    }

    return <SearchForm onSubmit={handleSearch} />;
  };

  return (
    <>
      <InteractiveBackground />
      <div className={styles.contentLayer}>
        {renderContent()}
      </div>
      <Analytics />
    </>
  );
};

export default App;
