import './App.css';
import ConfigForm from './components/ConfigForm';
//import { main } from 'scraper/main.js';

function App() {
  function runScraper(urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean, recipiant: string) {
    console.log('Values used for scraper:');
    console.log('---');
    console.log('urlSnippet: ' + urlSnippet);
    console.log('eventSlug: ' + eventSlug);
    console.log('mainPage: ' + mainPage);
    console.log('fragmentedPages: ' + fragmentedPages);
    console.log('recipiant: ' + recipiant);

    fetch('http://localhost:5000/run-scraper', {
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
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }

  return (
    <>
      <ConfigForm runScraper={runScraper} />
    </>
  );
}

export default App;
