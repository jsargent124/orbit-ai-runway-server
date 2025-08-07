// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

// IMAGE GENERATION ENDPOINT
app.post('/image', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing image prompt' });

  try {
    const response = await axios.post(
      'https://api.runwayml.com/v2/generate/image',
      { prompt },
      {
        headers: {
          'Authorization': `Bearer ${RUNWAY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ image_url: response.data.image_url });
  } catch (error) {
    console.error('Image generation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// VIDEO GENERATION ENDPOINT
app.post('/video', async (req, res) => {
  const { image_url, prompt } = req.body;
  if (!image_url || !prompt) return res.status(400).json({ error: 'Missing image_url or prompt' });

  try {
    const response = await axios.post(
      'https://api.runwayml.com/v2/generate/video',
      { image_url, prompt },
      {
        headers: {
          'Authorization': `Bearer ${RUNWAY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ video_url: response.data.video_url });
  } catch (error) {
    console.error('Video generation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate video' });
  }
});

app.listen(PORT, () => console.log(`Orbit AI Runway Server running on port ${PORT}`));
