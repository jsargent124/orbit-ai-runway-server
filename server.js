const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.post('/image', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(
      'https://api.dev.runwayml.com/v1/generate/image',
      {
        prompt: prompt,
        size: '1024x1024'
      },
      {
        headers: {
          'Authorization': `Bearer ${RUNWAY_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Runway-Version': '2024-05-21'  // ✅ This is the correct version for image gen
        }
      }
    );

    console.log('✅ Runway Response received. Pausing for 2 minutes...');
    await sleep(2 * 60 * 1000); // ⏱️ 2-minute delay

    res.status(200).json(response.data);

  } catch (error) {
    const errResponse = error.response?.data || error.message;
    console.error('❌ Error from Runway API:', errResponse);

    res.status(500).json({
      error: 'Failed to generate image',
      details: errResponse
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
