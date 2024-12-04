type ErrorState = {
  active: boolean;
  message: string;
};

async function startSummary(setError: React.Dispatch<React.SetStateAction<ErrorState>>) {
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
