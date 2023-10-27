require("dotenv").config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
// Express App
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.get('/', (req, res) => {
  return res.json({ message: "You are at home" })
});
app.post('/translate', async (req, res) => {
  const { translateFrom, translateTo, textToTranslate } = req.body;
  if (!translateFrom || !translateTo || !textToTranslate) {
    return res.json({ error: 'Some keys are missing data' });
  }
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      prompt: `Translate the following ${translateFrom} text to ${translateTo}: "${textToTranslate}"`,
      max_tokens: 150,
      temperature: 1,
      n: 1
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const translatedText = response.data.choices[0].text.trim();
    return res.json({ translatedText });
  } catch (error) {
    console.error('Error:', error?.response?.data);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/summerize', async (req, res) => {
  const {article}=req.body;
  if(!article){
    return res.json({error:'Some keys missing data'});
  }
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      prompt:`Summarize the following article:\n${article}\nSummary:`,
      max_tokens: 150,
      temperature: 1,
      n: 1
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const summary = response.data.choices[0].text.trim();
    return res.json({ summary });
  } catch (error) {
    console.error('Error:', error?.response?.data);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/textgen', async (req, res) => {
  const {text}=req.body;
  if(!text){
    return res.json({error:'Some keys missing data'});
  }
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      prompt:`Write a creative and relevant sentence about ${text}`,
      max_tokens: 150,
      temperature: 1,
      n: 1
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const genText = response.data.choices[0].text.trim();
    return res.json({ genText });
  } catch (error) {
    console.error('Error:', error?.response?.data);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
