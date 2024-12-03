const express = require('express');
const { run } = require('../main.cjs');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const port = 3500;

app.use(express.json());

app.post('/run', async (req, res) => {
  try {
    const { urlSnippet, eventSlug, mainPage, fragmentedPages } = req.body;
    await run(urlSnippet, eventSlug, mainPage, fragmentedPages);
    res.status(200).send('Scraping complete!');
  } catch (error) {
    throw error;
  }
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'gpt-4o-mini',
    });
    res.json(completion.choices[0].message);
  } catch (error) {
    throw error;
  }
});

app.get('/get-output-data', (req, res) => {
  const outputDir = path.join(__dirname, 'src', 'output');

  if (!fs.existsSync(outputDir)) {
    return res.status(400).send(`Directory ${outputDir} does not exist`);
  }

  const files = fs.readdirSync(outputDir);

  function compareFiles(a, b) {
    const fileA = path.join(outputDir, a);
    const fileB = path.join(outputDir, b);
    return fs.statSync(fileB).birthtime.getTime() - fs.statSync(fileA).birthtime.getTime();
  }

  const sortedFiles = files.sort(compareFiles);

  if (sortedFiles.length === 0) {
    return res.send('No .xlsx files found');
  }

  const latestFile = sortedFiles[0];
  const filePath = path.join(outputDir, latestFile);
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  const dataString = data.map((row) => row.join('\t')).join('\n');

  res.send(dataString);
});

app.post('/write-summary-doc', (req, res) => {
  const { summary } = req.body;

  if (!summary) {
    return res.status(400).send('No summary content provided');
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(summary)],
          }),
        ],
      },
    ],
  });

  const outputPath = path.join(__dirname, 'src', 'output', 'Summary.docx');

  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  Packer.toBuffer(doc)
    .then((buffer) => {
      fs.writeFileSync(outputPath, buffer);
      console.log(`Document saved at: ${outputPath}`);
      res.send({ message: `Document saved successfully at ${outputPath}` });
    })
    .catch((error) => {
      console.error('Error saving document:', error);
      res.status(500).send('Error saving document');
    });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
