const express = require('express');
const { run } = require('../scraper/scraper.cjs');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const xlsx = require('xlsx');
const app = express();
const port = 3500;
const OpenAI = require('openai');
const dotenv = require('dotenv');
const { Document, Packer, Paragraph, TextRun } = require('docx');

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  const outputDir = path.join(__dirname, '..', '..', 'src', 'output');

  console.log('STARTING GET OUTPUT DATA REQUEST ---');
  console.log('Output Directory:', outputDir);

  if (!fs.existsSync(outputDir)) {
    return res.status(400).send(`Directory ${outputDir} does not exist`);
  }

  const files = fs.readdirSync(outputDir);
  console.log('Files in directory:', files);

  const xlsxFiles = files.filter((file) => file.endsWith('.xlsx'));
  console.log('Excel files:', xlsxFiles);

  function compareFiles(a, b) {
    const fileA = path.join(outputDir, a);
    const fileB = path.join(outputDir, b);
    return fs.statSync(fileB).birthtime.getTime() - fs.statSync(fileA).birthtime.getTime();
  }

  const sortedFiles = xlsxFiles.sort(compareFiles);

  if (sortedFiles.length === 0) {
    console.warn('No .xlsx files found');
    return res.send('No .xlsx files found');
  }

  const latestFile = sortedFiles[0];
  const filePath = path.join(outputDir, latestFile);

  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    const dataString = data.map((row) => row.join('\t')).join('\n');
    res.send(dataString);
  } catch (error) {
    return res.status(500).send(`Error processing file: ${error.message}`);
  }
});

app.post('/write-summary-doc', (req, res) => {
  const { summary, eventSlug } = req.body;

  if (!summary) {
    return res.status(400).send('No summary content provided');
  }
  if (!eventSlug) {
    return res.status(400).send('No eventSlug provided');
  }

  const date = new Date();
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`;

  const fileName = `summary_${eventSlug}_${formattedDate}.docx`;
  const outputPath = path.join(__dirname, '..', '..', 'src', 'output', fileName);

  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
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

app.get('/download-files', (req, res) => {
  const outputDir = path.resolve(process.cwd(), 'src', 'output');
  fs.readdir(outputDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading the output directory');
    }
    files = files.filter((file) => fs.statSync(path.join(outputDir, file)).isFile());
    files.sort((a, b) => fs.statSync(path.join(outputDir, b)).mtime - fs.statSync(path.join(outputDir, a)).mtime);
    const latestFiles = files.slice(0, 3);

    if (latestFiles.length === 0) {
      return res.status(404).send('No files found in the output directory');
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    res.attachment('latest_files.zip');

    archive.pipe(res);

    latestFiles.forEach((file) => {
      archive.file(path.join(outputDir, file), { name: file });
    });

    archive.finalize();
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
