import { useEffect, useState } from 'react';

const TargetForm = () => {
  // eleventravel.nl
  const [urlSnippet, setUrlSnippet] = useState<string>('');
  const [eventSlug, setEventSlug] = useState<string>('');

  // partybussen.nl
  const [MainPage, SetMainPage] = useState<string>('');
  //const [FragmentedPages, SetFragmentedPages] = useState<boolean>(false);

  useEffect(() => {
    console.log(urlSnippet);
    console.log(eventSlug);
    console.log(MainPage);
  }, [urlSnippet, eventSlug, MainPage]);

  return (
    <form className="flex w-[500px] flex-col items-start justify-start gap-1">
      <h2 className="font-poppins text-2xl font-semibold">Eleven Travel</h2>
      <label className="font-poppins text-lg font-medium text-white text-opacity-60">Hoofd URL padsegment</label>
      <input
        onChange={(e) => {
          setUrlSnippet(e.target.value);
        }}
        className="w-full rounded-md bg-white bg-opacity-10 px-4 py-2 font-poppins text-lg font-medium"
      ></input>
      <label className="font-poppins text-lg font-medium text-white text-opacity-60">Event slug</label>
      <input
        onChange={(e) => {
          setEventSlug(e.target.value);
        }}
        className="w-full rounded-md bg-white bg-opacity-10 px-4 py-2 font-poppins text-lg font-medium"
      ></input>
      <h2 className="font-poppins text-2xl font-semibold">Partybussen</h2>
      <label className="font-poppins text-lg font-medium text-white text-opacity-60">Hoofd URL</label>
      <input
        onChange={(e) => {
          SetMainPage(e.target.value);
        }}
        className="w-full rounded-md bg-white bg-opacity-10 px-4 py-2 font-poppins text-lg font-medium"
      ></input>
    </form>
  );
};

export default TargetForm;
