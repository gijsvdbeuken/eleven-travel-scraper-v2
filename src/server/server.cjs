const express = require('express');
const { run } = require('../main.cjs');

const app = express();
const port = 3500;

app.use(express.json());

app.post('/run', async (req, res) => {
  try {
    console.log('Starting run()');
    const { urlSnippet, eventSlug, mainPage, fragmentedPages, recipiant } = req.body;
    await run(urlSnippet, eventSlug, mainPage, fragmentedPages, recipiant);
    res.status(200).send('Scraping complete!');
  } catch (error) {
    throw error;
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
