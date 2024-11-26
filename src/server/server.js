const express = require('express');
const { run } = require('../main');

const app = express();
const port = 5000;

app.use(express.json());

app.post('/run-scraper', async (req, res) => {
  try {
    await run();
    res.status(200).send('Scraping complete!');
  } catch (error) {
    res.status(500).send('Error running scraper: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
