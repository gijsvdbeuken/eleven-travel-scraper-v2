import './App.css';
import ConfigForm from './components/ConfigForm';
import { useState } from 'react';
import ErrorPopup from './components/ErrorPopup';
import startScraper from './api/runScraper';
import startSummary from './api/runSummary';

function App() {
  const [error, setError] = useState({ active: false, message: '' });
  const [processing, setProcessing] = useState<boolean>(false);

  const runScraper = async (urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean) => {
    setProcessing(true);
    try {
      await startScraper(urlSnippet, eventSlug, mainPage, fragmentedPages, setError);
    } catch (error: any) {
      setError({ active: true, message: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const runSummary = async (eventSlug: string) => {
    console.log('Summary is running!');
    setProcessing(true);
    try {
      await startSummary(eventSlug, setError);
    } catch (error: any) {
      setError({ active: true, message: error.message });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <ErrorPopup error={error} />
      <ConfigForm setError={setError} processing={processing} runScraper={runScraper} runSummary={runSummary} />
    </>
  );
}

export default App;
