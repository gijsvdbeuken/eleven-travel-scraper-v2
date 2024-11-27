import './App.css';
import ConfigForm from './components/ConfigForm';
import { useState } from 'react';
import ErrorPopup from './components/ErrorPopup';

function App() {
  const [error, setError] = useState({ active: false, message: '' });

  function runScraper(urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean, recipiant: string) {
    console.log('Values used for scraper: ' + urlSnippet + ' ' + eventSlug + ' ' + mainPage + ' ' + fragmentedPages + ' ' + recipiant);

    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3500/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            urlSnippet,
            eventSlug,
            mainPage,
            fragmentedPages,
            recipiant,
          }),
        });
        if (!response.ok) {
          console.error('Raw response:', response);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get('Content-Type');
        let data;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        console.log('Response:', data);
      } catch (error) {
        if (error instanceof Error) {
          setError({ active: true, message: error.message + '. Controleer of alle velden correct zijn ingevuld en of de server actief is.' });
        } else {
          setError({ active: true, message: 'An unknown error occurred' });
        }
      }
    }
    fetchData();
  }

  return (
    <>
      <ErrorPopup error={error} />
      <ConfigForm setError={setError} runScraper={runScraper} />
    </>
  );
}

export default App;
