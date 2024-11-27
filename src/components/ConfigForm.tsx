import { useState } from 'react';

interface ConfigFormProps {
  runScraper: (urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean, recipiant: string) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ runScraper }) => {
  // eleventravel.nl
  const [urlSnippet, setUrlSnippet] = useState<string>('');
  const [eventSlug, setEventSlug] = useState<string>('');

  // partybussen.nl
  const [mainPage, setMainPage] = useState<string>('');
  const [fragmentedPages, setFragmentedPages] = useState<boolean>(true);

  const [recipiant, setRecipiant] = useState<string>('');

  function turnFragmentedPagesOn() {
    if (fragmentedPages === true) {
      return;
    }
    setFragmentedPages(true);
  }

  function turnFragmentedPagesOff() {
    if (fragmentedPages === false) {
      return;
    }
    setFragmentedPages(false);
  }

  function submitForm(urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean, recipiant: string) {
    if (urlSnippet === 'test') {
      urlSnippet = 'thunderdome-alpha-zaterdag-2024';
      eventSlug = 'thunderdome-alpha';
      mainPage = 'https://www.partybussen.nl/festivals/thunderdome-alpha-zaterdag-2024';
      fragmentedPages = true;
      recipiant = 'gijs@kantoor.geen-gedoe.nl';
    }

    if (!urlSnippet || !eventSlug || !mainPage || !recipiant) {
      console.error('Alle parameters moeten een waarde hebben.');
      return;
    }
    runScraper(urlSnippet, eventSlug, mainPage, fragmentedPages, recipiant);
  }

  return (
    <form className="flex w-[400px] flex-col items-start justify-start gap-1 rounded-lg border-2 border-white/15 p-2">
      <h2 className="text-l font-poppins font-semibold">Gegevens van Eleven Travel</h2>
      <label className="text-l font-poppins font-medium text-white text-opacity-60">Hoofd URL padsegment</label>
      <input
        onChange={(e) => {
          setUrlSnippet(e.target.value);
        }}
        className="text-l w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins font-medium"
      ></input>
      <label className="text-l font-poppins font-medium text-white text-opacity-60">Event slug</label>
      <input
        onChange={(e) => {
          setEventSlug(e.target.value);
        }}
        className="text-l w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins font-medium"
      ></input>
      <h2 className="text-l font-poppins font-semibold">Gegevens van Partybussen</h2>
      <label className="text-l font-poppins font-medium text-white text-opacity-60">Hoofd URL</label>
      <input
        onChange={(e) => {
          setMainPage(e.target.value);
        }}
        className="text-l w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins font-medium"
      ></input>
      <label className="text-l font-poppins font-medium text-white text-opacity-60">Gefragmenteerde pagina's?</label>
      <div className="my-1 flex w-full gap-x-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            turnFragmentedPagesOn();
          }}
          className={`w-1/2 ${fragmentedPages === true ? 'bg-etorange' : ''} text-l px-4 py-2 font-poppins font-semibold text-white`}
        >
          Ja
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            turnFragmentedPagesOff();
          }}
          className={`w-1/2 ${fragmentedPages === true ? '' : 'bg-etorange'} text-l px-4 py-2 font-poppins font-semibold text-white`}
        >
          Nee
        </button>
      </div>
      <h2 className="text-l font-poppins font-semibold">Verzendgegevens</h2>
      <label className="text-l font-poppins font-medium text-white text-opacity-60">Ontvanger</label>
      <input
        onChange={(e) => {
          setRecipiant(e.target.value);
        }}
        className="text-l w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins font-medium"
      ></input>
      <button
        className="text-l my-2 w-full rounded-md bg-etorange px-4 py-2 font-poppins font-semibold text-white"
        onClick={(e) => {
          e.preventDefault();
          submitForm(urlSnippet, eventSlug, mainPage, fragmentedPages, recipiant);
        }}
      >
        Vergelijken
      </button>
    </form>
  );
};

export default ConfigForm;
