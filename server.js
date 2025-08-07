import express from 'express';
import RunwayML, { TaskFailedError } from '@runwayml/sdk';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const client = new RunwayML({ apiKey: process.env.RUNWAY_API_KEY });

app.post('/image', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    console.log('📤 Submitting task to Runway...');
    const task = await client.textToImage
      .create({
        model: 'gen4_image',
        ratio: '1:1',
        promptText: prompt
      })
      .waitForTaskOutput();

    const output = task.output?.[0];

    if (!output) {
      return res.status(500).json({ error: 'No image output returned.' });
    }

    console.log('✅ Image generation complete:', output);
    res.status(200).json({ imageUrl: output });

  } catch (error) {
    if (error instanceof TaskFailedError) {
      console.error('❌ Runway task failed:', error.taskDetails);
      return res.status(500).json({
        error: 'Image generation failed',
        details: error.taskDetails
      });
    } else {
      console.error('❌ Unexpected error:', error);
      return res.status(500).json({
        error: 'Unexpected server error',
        details: error.message
      });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SDK-based Runway server live on port ${PORT}`);
});
