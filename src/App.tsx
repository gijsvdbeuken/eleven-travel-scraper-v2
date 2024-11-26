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
  }

  return (
    <div className="min-w-500">
      <ConfigForm runScraper={runScraper} />
    </div>
  );
}

export default App;
