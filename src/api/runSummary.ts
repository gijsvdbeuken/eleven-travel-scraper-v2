type ErrorState = {
  active: boolean;
  message: string;
};

async function startSummary(eventSlug: string, setError: React.Dispatch<React.SetStateAction<ErrorState>>) {
  try {
    console.log('Summary data wordt opgehaald!');
    const dataResponse = await fetch('http://localhost:3500/get-output-data');
    const data = await dataResponse.text();
    const res = await fetch('http://localhost:3500/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'De volgende data omvatten de prijsverschillen voor bustickets tussen ons bedrijf, eleventravel.nl, en onze concurrent, partybussen.nl. Schrijf in alinea-vorm zonder compelexe syntax een korte samenvatting m.b.t. de grootste verschillen en trends. : ' + data }),
    });
    const chatData = await res.json();
    const writeRes = await fetch('http://localhost:3500/write-summary-doc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: chatData.content,
        eventSlug: eventSlug,
      }),
    });
    const writeResult = await writeRes.json();
    console.log(writeResult.message);
  } catch (error) {
    if (error instanceof Error) {
      setError({
        active: true,
        message: error.message + '. Controleer of alle velden correct zijn ingevuld en of de server actief is.',
      });
    } else {
      setError({ active: true, message: 'An unknown error occurred' });
    }
  }
}

export default startSummary;
