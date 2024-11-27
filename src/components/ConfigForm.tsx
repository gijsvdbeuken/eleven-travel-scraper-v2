import { useState } from 'react';

interface ErrorState {
  active: boolean;
  message: string;
}

interface ConfigFormProps {
  setError: React.Dispatch<React.SetStateAction<ErrorState>>;
  runScraper: (urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean, recipiant: string) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ setError, runScraper }) => {
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
    setError({ active: false, message: '' });
    if (urlSnippet == 'test') {
      urlSnippet = 'thunderdome-alpha-zaterdag-2024';
      eventSlug = 'thunderdome-alpha';
      mainPage = 'https://www.partybussen.nl/festivals/thunderdome-alpha-zaterdag-2024';
      fragmentedPages = true;
      recipiant = 'gijs@kantoor.geen-gedoe.nl';
    }
    if (!urlSnippet || !eventSlug || !mainPage || !recipiant) {
      console.error('Alle parameters moeten een waarde hebben: ' + urlSnippet + eventSlug + mainPage + recipiant);
      setError({ active: true, message: 'Alle parameters moeten een waarde hebben.' });
      return;
    }
    runScraper(urlSnippet, eventSlug, mainPage, fragmentedPages, recipiant);
  }

  return (
    <>
      <form className="flex w-[350px] flex-col items-start justify-start gap-1 rounded-lg border-2 border-white/15 p-2">
        <h1 className="my-2 font-poppins text-[20px] font-semibold">Eleven Travel scraper</h1>

        <label className="font-poppins text-[16px] font-medium text-white">Event slug van festival (ET)</label>
        <input
          onChange={(e) => {
            setEventSlug(e.target.value);
          }}
          placeholder="thunderdome-alpha"
          className="w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins text-[16px] font-medium placeholder-white placeholder-opacity-15"
        ></input>

        <label className="font-poppins text-[16px] font-medium text-white">Hoofdpagina van festival (PB)</label>
        <input
          onChange={(e) => {
            setMainPage(e.target.value);
          }}
          placeholder="https://www.partybussen.nl/festivals/."
          className="w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins text-[16px] font-medium placeholder-white placeholder-opacity-15"
        ></input>
        <label className="font-poppins text-[16px] font-medium text-white">Padsegment van festival (PB)</label>
        <input
          onChange={(e) => {
            setUrlSnippet(e.target.value);
          }}
          placeholder="thunderdome-alpha-zaterdag-2024"
          className="w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins text-[16px] font-medium placeholder-white placeholder-opacity-15"
        ></input>
        <label className="font-poppins text-[16px] font-medium text-white">Gefragmenteerde pagina's? (PB)</label>
        <div className="my-1 flex w-full gap-x-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              turnFragmentedPagesOn();
            }}
            className={`w-1/2 ${fragmentedPages === true ? 'bg-etorange' : ''} px-4 py-2 font-poppins text-[16px] font-semibold text-white`}
          >
            Ja
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              turnFragmentedPagesOff();
            }}
            className={`w-1/2 ${fragmentedPages === true ? '' : 'bg-etorange'} px-4 py-2 font-poppins text-[16px] font-semibold text-white`}
          >
            Nee
          </button>
        </div>
        <label className="font-poppins text-[16px] font-medium text-white">Ontvanger van analyses</label>
        <input
          onChange={(e) => {
            setRecipiant(e.target.value);
          }}
          placeholder="gijs@kantoor.geen-gedoe.nl"
          className="w-full rounded-md bg-white bg-opacity-10 px-2 py-2 font-poppins text-[16px] font-medium placeholder-white placeholder-opacity-15"
        ></input>
        <button
          className="my-2 w-full rounded-md bg-etorange px-4 py-2 font-poppins text-[16px] font-semibold text-white"
          onClick={(e) => {
            e.preventDefault();
            submitForm(urlSnippet, eventSlug, mainPage, fragmentedPages, recipiant);
          }}
        >
          Vergelijken
        </button>
      </form>
    </>
  );
};

export default ConfigForm;
