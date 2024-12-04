type ErrorState = {
  active: boolean;
  message: string;
};

async function startScraper(urlSnippet: string, eventSlug: string, mainPage: string, fragmentedPages: boolean, setError: React.Dispatch<React.SetStateAction<ErrorState>>) {
  console.log('Values used for scraper: ' + urlSnippet + ' ' + eventSlug + ' ' + mainPage + ' ' + fragmentedPages);
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
  } catch (error) {
    if (error instanceof Error) {
      setError({ active: true, message: error.message + '. Controleer of alle velden correct zijn ingevuld en of de server actief is.' });
    } else {
      setError({ active: true, message: 'An unknown error occurred' });
    }
  }
}

export default startScraper;
