/*
urlSnippet = 'thunderdome-alpha-zaterdag-2024';
eventSlug = 'thunderdome-alpha';
mainPage = 'https://www.partybussen.nl/festivals/thunderdome-alpha-zaterdag-2024';
fragmentedPages = true;
*/

// free-your-mind-kingsday
// https://www.partybussen.nl/festivals/free-your-mind-kingsday-2025-vrijdag
// https://www.partybussen.nl/festivals/free-your-mind-kingsday-2025-vrijdag/provincie-9-zuid-holland#province-9
// free-your-mind-kingsday-2025-vrijdag

import { useState } from 'react';

interface ErrorState {
  active: boolean;
  message: string;
}

interface ConfigFormProps {
  setError: React.Dispatch<React.SetStateAction<ErrorState>>;
  processing: boolean;
  runScraper: (urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean) => void;
  runSummary: () => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ setError, processing, runScraper, runSummary }) => {
  // eleventravel.nl
  const [eventSlug, setEventSlug] = useState<string>('');

  // partybussen.nl
  const [urlSnippet, setUrlSnippet] = useState<string>('');
  const [mainPage, setMainPage] = useState<string>('');
  const [fragmentedPages, setFragmentedPages] = useState<boolean>(false);

  // analysis
  const [summary, setSummary] = useState<boolean>(false);

  function submitForm(urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean, summary: boolean) {
    if (eventSlug === 'x') {
      urlSnippet = 'free-your-mind-kingsday-2025-vrijdag';
      eventSlug = 'free-your-mind-kingsday';
      mainPage = 'https://www.partybussen.nl/festivals/free-your-mind-kingsday-2025-vrijdag';
      fragmentedPages = true;
    }
    setError({ active: false, message: '' });
    if (!urlSnippet || !eventSlug || !mainPage) {
      setError({ active: true, message: 'Alle technische velden moeten een waarde hebben.' });
      return;
    }
    runScraper(urlSnippet, eventSlug, mainPage, fragmentedPages);
    if (summary) {
      runSummary();
    }
  }

  return (
    <>
      <form className="flex w-[350px] flex-col items-start justify-start gap-1 rounded-lg border-2 border-white/15 p-2">
        <h1 className="my-2 font-poppins text-[20px] font-semibold">Eleven Travel scraper</h1>
        <label className="mt-2 font-poppins text-[14px] font-medium text-white">Event slug van festival (ET)</label>
        <input
          onChange={(e) => {
            setEventSlug(e.target.value);
          }}
          placeholder="thunderdome-alpha"
          className="w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins text-[14px] font-medium placeholder-white placeholder-opacity-15"
        ></input>

        <label className="mt-2 font-poppins text-[14px] font-medium text-white">Hoofdpagina van festival (PB)</label>
        <input
          onChange={(e) => {
            setMainPage(e.target.value);
          }}
          placeholder="https://www.partybussen.nl/festivals/..."
          className="w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins text-[14px] font-medium placeholder-white placeholder-opacity-15"
        ></input>
        <label className="mt-2 font-poppins text-[14px] font-medium text-white">Padsegment van festival (PB)</label>
        <input
          onChange={(e) => {
            setUrlSnippet(e.target.value);
          }}
          placeholder="thunderdome-alpha-zaterdag-2024"
          className="w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins text-[14px] font-medium placeholder-white placeholder-opacity-15"
        ></input>
        <label className="mt-2 font-poppins text-[14px] font-medium text-white">Gefragmenteerde pagina's? (PB)</label>
        <div className="my-1 flex w-full gap-x-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              setFragmentedPages(true);
            }}
            className={`w-1/2 ${fragmentedPages === true ? 'bg-etorange text-white' : 'text-white text-opacity-15'} px-4 py-2 font-poppins text-[14px] font-semibold`}
          >
            Ja
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setFragmentedPages(false);
            }}
            className={`w-1/2 ${fragmentedPages === true ? 'text-white text-opacity-15' : 'bg-etorange text-white'} px-4 py-2 font-poppins text-[14px] font-semibold`}
          >
            Nee
          </button>
        </div>
        <label className="mt-2 font-poppins text-[14px] font-medium text-white">Analyse door ChatGPT?</label>
        <div className="my-1 flex w-full gap-x-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              setSummary(true);
            }}
            className={`w-1/2 ${summary === true ? 'bg-etorange text-white' : 'text-white text-opacity-15'} px-4 py-2 font-poppins text-[14px] font-semibold`}
          >
            Ja
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setSummary(false);
            }}
            className={`w-1/2 ${summary === true ? 'text-white text-opacity-15' : 'bg-etorange text-white'} px-4 py-2 font-poppins text-[14px] font-semibold`}
          >
            Nee
          </button>
        </div>
        <button
          className={processing === true ? 'mt-1 w-full rounded-md bg-black px-4 py-2 font-poppins text-[14px] font-semibold text-white text-opacity-15' : 'mt-1 w-full rounded-md bg-etorange px-4 py-2 font-poppins text-[14px] font-semibold text-white'}
          onClick={(e) => {
            e.preventDefault();
            submitForm(urlSnippet, eventSlug, mainPage, fragmentedPages, summary);
          }}
        >
          {processing === true ? 'Verwerken...' : 'Vergelijken'}
        </button>
      </form>
    </>
  );
};

export default ConfigForm;
