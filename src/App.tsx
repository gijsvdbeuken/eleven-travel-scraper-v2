import './App.css';
import ConfigForm from './components/ConfigForm';
import { useState } from 'react';
import ErrorPopup from './components/ErrorPopup';
import startScraper from './api/runScraper';
import startSummary from './api/runSummary';

function App() {
  const [error, setError] = useState({ active: false, message: '' });
  const [processing, setProcessing] = useState<boolean>(false);

  function runScraper(urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean) {
    setProcessing(true);
    startScraper(urlSnippet, eventSlug, mainPage, fragmentedPages, setError);
    setProcessing(false);
  }

  function runSummary() {
    setProcessing(true);
    startSummary(setError);
    setProcessing(false);
  }

  return (
    <>
      <ErrorPopup error={error} />
      <ConfigForm setError={setError} processing={processing} runScraper={runScraper} runSummary={runSummary} />
    </>
  );
}

export default App;
