import './App.css';
import ConfigForm from './components/ConfigForm';
import { useState } from 'react';
import ErrorPopup from './components/ErrorPopup';

function App() {
  const [error, setError] = useState({ active: false, message: '' });
  const [processing, setProcessing] = useState<boolean>(false);

  function runScraper(urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean) {
    console.log('Values used for scraper: ' + urlSnippet + ' ' + eventSlug + ' ' + mainPage + ' ' + fragmentedPages);
    async function fetchData() {
      async function downloadFiles() {
        try {
          const response = await fetch('http://localhost:3500/download-files');

          if (!response.ok) {
            throw new Error('Failed to fetch files');
          }

          const blob = await response.blob();
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'latest_files.zip';
          link.click();
        } catch (error) {
          console.error('Error:', error);
        }
      }
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

        await downloadFiles();

        setProcessing(false);
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

  function runSummary() {
    async function fetchResponse() {
      try {
        const dataResponse = await fetch('http://localhost:3000/get-summary-data');
        const data = await dataResponse.text();
        const res = await fetch('http://localhost:3500/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Schrijf een korte samenvatting m.b.t. de volgende data: ' + data }),
        });
        const chatData = await res.json();
        const writeRes = await fetch('http://localhost:3500/write-summary-doc', {
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
    </>
  );
}

export default App;
