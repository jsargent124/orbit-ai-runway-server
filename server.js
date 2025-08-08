import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/dalle', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: prompt,
        n: 1,
        size: '1024x1024'
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const imageUrl = response.data.data?.[0]?.url;
    if (!imageUrl) {
      return res.status(500).json({ error: 'No image returned by OpenAI' });
    }

    console.log('🎨 DALL·E Image Generated:', imageUrl);
    res.status(200).json({ imageUrl });

  } catch (error) {
    const errResponse = error.response?.data || error.message;
    console.error('❌ Error from OpenAI API:', errResponse);
    res.status(500).json({
      error: 'Failed to generate image from OpenAI',
      details: errResponse
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 DALL·E server is live on port ${PORT}`);
});
