import './App.css';
import ConfigForm from './components/ConfigForm';

function App() {
  function runScraper(urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean, recipiant: string) {
    console.log('Values used for scraper:');
    console.log('---');
    console.log('urlSnippet: ' + urlSnippet);
    console.log('eventSlug: ' + eventSlug);
    console.log('mainPage: ' + mainPage);
    console.log('fragmentedPages: ' + fragmentedPages);
    console.log('recipiant: ' + recipiant);

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
        console.error('Error:', error);
      }
    }
    fetchData();
  }

  return (
    <>
      <ConfigForm runScraper={runScraper} />
    </>
  );
}

export default App;
