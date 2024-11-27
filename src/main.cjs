const puppeteer = require('puppeteer');
const fetchElevenTravelData = require('./api/fetchElevenTravelData.cjs');
const createLocationMatches = require('./utilities/createLocationMatches.cjs');
const createXlsxProvincesFile = require('./utilities/createXlsxProvincesFile.cjs');
const createXlsxLocationsFile = require('./utilities/createXlsxLocationsFile.cjs');

async function run(urlSnippet, slug, mainPage, fragmentedPage, recipiant) {
  if (!slug) {
    return;
  }

  const baseUrl = mainPage;
  const baseUrlHasBranches = fragmentedPage;
  const baseUrlBranch = urlSnippet;
  const eventSlug = slug;
  const xlsxDocName = eventSlug;

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const selectors = [
    { name: 'Groningen', selector: '[name="province-1"]', url: `/festivals/${baseUrlBranch}/provincie-1-groningen#province-1` },
    { name: 'Friesland', selector: '[name="province-2"]', url: `/festivals/${baseUrlBranch}/provincie-2-friesland#province-2` },
    { name: 'Drenthe', selector: '[name="province-3"]', url: `/festivals/${baseUrlBranch}/provincie-3-drenthe#province-3` },
    { name: 'Overijssel', selector: '[name="province-4"]', url: `/festivals/${baseUrlBranch}/provincie-4-overijssel#province-4` },
    { name: 'Flevoland', selector: '[name="province-5"]', url: `/festivals/${baseUrlBranch}/provincie-5-flevoland#province-5` },
    { name: 'Gelderland', selector: '[name="province-6"]', url: `/festivals/${baseUrlBranch}/provincie-6-gelderland#province-6` },
    { name: 'Utrecht', selector: '[name="province-7"]', url: `/festivals/${baseUrlBranch}/provincie-7-utrecht#province-7` },
    { name: 'Noord-Holland', selector: '[name="province-8"]', url: `/festivals/${baseUrlBranch}/provincie-8-noord-holland#province-8` },
    { name: 'Zuid-Holland', selector: '[name="province-9"]', url: `/festivals/${baseUrlBranch}/provincie-9-zuid-holland#province-9` },
    { name: 'Noord-Brabant', selector: '[name="province-10"]', url: `/festivals/${baseUrlBranch}/provincie-10-noord-brabant#province-10` },
    { name: 'Zeeland', selector: '[name="province-11"]', url: `/festivals/${baseUrlBranch}/provincie-11-zeeland#province-11` },
    { name: 'Limburg', selector: '[name="province-12"]', url: `/festivals/${baseUrlBranch}/provincie-12-limburg#province-12` },
  ];

  let pbProvinces = [];
  let pbCities = [];
  let pbLocations = [];
  let pbPrices = [];

  async function extractLocationData() {
    for (const province of selectors) {
      const targetCities = await page.evaluate((selector) => {
        const elements = document.querySelectorAll(`${selector} .locatie`);
        return Array.from(elements).map((element) => {
          function findFirstTextNode(node) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              return node.textContent.trim();
            }
            for (let child of node.childNodes) {
              const foundText = findFirstTextNode(child);
              if (foundText) {
                return foundText;
              }
            }
            return null;
          }
          return findFirstTextNode(element);
        });
      }, province.selector);

      const targetLocations = await page.evaluate((selector) => {
        const elements = document.querySelectorAll(`${selector} .loc-naam`);
        return Array.from(elements).map((element) => element.textContent.trim());
      }, province.selector);

      const targetPrices = await page.evaluate((selector) => {
        const elements = document.querySelectorAll(`${selector} .prijs`);
        return Array.from(elements).map((element) => {
          let text = '';
          element.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              text += node.textContent.trim();
              text = text.replace(',', '.');
              text = text.replace(/[^0-9.]/g, '');
            }
          });
          return text;
        });
      }, province.selector);

      const provinceCount = targetCities.length;
      pbProvinces.push(...Array(provinceCount).fill(province.name));
      pbCities.push(...targetCities);
      pbLocations.push(...targetLocations);
      pbPrices.push(...targetPrices);
    }
  }

  function createProvinceDataset(data) {
    const headers = ['provincie', 'gem_prijs_pb', 'gem_prijs_et', 'prijs_verschil'];
    const provinceDataset = selectors.map((province) => {
      const targetProvince = province.name;
      const filteredRows = data.filter((row) => row[0] === targetProvince);
      const totalPricePb = filteredRows.reduce((sum, row) => sum + parseFloat(row[5]), 0);
      const averagePricePb = totalPricePb / filteredRows.length;
      const validRows = filteredRows.filter((row) => row[6] !== 'N/A');
      const totalPriceEt = validRows.reduce((sum, row) => sum + parseFloat(row[6]), 0);
      const averagePriceEt = totalPriceEt / validRows.length;
      const priceDifference = (averagePriceEt - averagePricePb).toFixed(2);

      return [targetProvince, averagePricePb.toFixed(2), averagePriceEt.toFixed(2), priceDifference];
    });
    provinceDataset.unshift(headers);
    createXlsxProvincesFile(provinceDataset, xlsxDocName);
  }

  try {
    console.log('Start!');
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 60000 });
    console.log('x');
    await page.waitForSelector('.columns.small-12.medium-8', { timeout: 30000 });

    console.log('Base url with selector located!');

    if (!baseUrlHasBranches) {
      await extractLocationData();
    } else if (baseUrlHasBranches) {
      for (let i = 0; i < 12; i++) {
        const selector = `a[href="${selectors[i].url}"]`;
        console.log(`Waiting for link selector: ${selector}`);

        await page.waitForSelector(selector, { timeout: 30000 });
        console.log('Link selector found!');

        console.log('Current URL:', page.url());

        await page.evaluate((sel) => {
          const element = document.querySelector(sel);
          if (element) {
            element.click();
            return true;
          }
          return false;
        }, selector);

        console.log('Click attempt completed. Waiting for potential navigation...');

        try {
          await page.waitForNavigation({ timeout: 10000 });
        } catch (navError) {
          console.log("Navigation didn't occur or timed out. This might be expected if the link doesn't navigate to a new page.");
        }

        console.log('New URL:', page.url());

        await extractLocationData();

        await page.goBack({ waitUntil: 'networkidle0' });
      }
    }

    if (pbCities.length == pbLocations.length && pbLocations.length == pbPrices.length) {
      let { etCities, etLocations, etPrices } = await fetchElevenTravelData(slug);
      const matchedData = createLocationMatches(pbProvinces, pbCities, pbLocations, pbPrices, etCities, etLocations, etPrices);
      const data = [['provincies', 'stad', 'locatie_pb', 'locatie_et', 'locatie_match', 'prijs_pb', 'prijs_et', 'prijs_verschil'], ...matchedData];
      createXlsxLocationsFile(data, xlsxDocName);
      createProvinceDataset(data);
    } else {
      console.error('Amount of records scraped from partybussen.nl do not match: ' + 'Cities: ' + pbCities.length + ', Locations: ' + pbLocations.length + ', Prices: ' + pbPrices.length);
    }
  } catch (error) {
    console.log('Error: ' + error);
    throw error;
  } finally {
    await browser.close();
  }
}

//run();
module.exports = { run };
