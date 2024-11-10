const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.post('/api/frequencies', async (req, res) => {
    const { url, n } = req.body;  // Extract n from request body
  
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
  
      const content = await page.evaluate(() => {
        return document.body.innerText;
      });
  
      await browser.close();
  
      const wordFrequency = analyzeWordFrequency(content, n);  // Use the value of n here
      res.json(wordFrequency);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error fetching or analyzing the URL' });
    }
  });

function analyzeWordFrequency(text, n) {
  const words = text.match(/\b\w+\b/g) || [];
  const frequencyMap = {};

  words.forEach(word => {
    word = word.toLowerCase();
    frequencyMap[word] = (frequencyMap[word] || 0) + 1;
  });

  console.log('Frequency Map:', frequencyMap);  // Log the frequency map for debugging

  const sortedFrequencies = Object.entries(frequencyMap)
    .sort(([, a], [, b]) => b - a)  // Sort based on frequency
    .slice(0, n)  // Get the top 'n' frequencies
    .map(([word, count]) => ({ word, count }));

  console.log('Sorted Frequencies:', sortedFrequencies);  // Log the sorted word frequencies

  return sortedFrequencies;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
