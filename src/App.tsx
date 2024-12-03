import './App.css';
import ConfigForm from './components/ConfigForm';
import { useState } from 'react';
import ErrorPopup from './components/ErrorPopup';

function App() {
  const [error, setError] = useState({ active: false, message: '' });
  const [processing, setProcessing] = useState<boolean>(false);

<<<<<<< HEAD
  function runScraper(urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean, recipiant: string) {
    console.log('Values used for scraper: ' + urlSnippet + ' ' + eventSlug + ' ' + mainPage + ' ' + fragmentedPages + ' ' + recipiant);

=======
  function runScraper(urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean) {
    console.log('Values used for scraper: ' + urlSnippet + ' ' + eventSlug + ' ' + mainPage + ' ' + fragmentedPages);
>>>>>>> dev
    async function fetchData() {
      try {
        setProcessing(true);
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
<<<<<<< HEAD
            recipiant,
=======
>>>>>>> dev
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
          setProcessing(false);
        } else {
          data = await response.text();
          setProcessing(false);
        }
        console.log('Response:', data);
      } catch (error) {
        if (error instanceof Error) {
          setError({ active: true, message: error.message + '. Controleer of alle velden correct zijn ingevuld en of de server actief is.' });
          setProcessing(false);
        } else {
          setError({ active: true, message: 'An unknown error occurred' });
          setProcessing(false);
        }
      }
    }
    fetchData();
  }

<<<<<<< HEAD
  return (
    <>
      <ErrorPopup error={error} />
      <ConfigForm setError={setError} processing={processing} runScraper={runScraper} />
=======
  function runSummary() {
    async function fetchResponse() {
      try {
        const dataResponse = await fetch('http://localhost:3500/get-summary-data');
        const data = await dataResponse.text();
        const res = await fetch('http://localhost:3500/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Schrijf een korte samenvatting m.b.t. de volgende data: ' + data }),
        });
        const chatData = await res.json();
        const writeRes = await fetch('http://localhost:3000/write-summary-doc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ summary: chatData.content }),
        });
        const writeResult = await writeRes.json();
        console.log(writeResult.message);
        setProcessing(false);
      } catch (error) {
        if (error instanceof Error) {
          setError({
            active: true,
            message: error.message + '. Controleer of alle velden correct zijn ingevuld en of de server actief is.',
          });
          setProcessing(false);
        } else {
          setError({ active: true, message: 'An unknown error occurred' });
          setProcessing(false);
        }
      }
    }
    fetchResponse();
  }

  return (
    <>
      <ErrorPopup error={error} />
      <ConfigForm setError={setError} processing={processing} runScraper={runScraper} runSummary={runSummary} />
>>>>>>> dev
    </>
  );
}

export default App;
