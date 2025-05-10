// server.js - Simple Claude API proxy server
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Your Claude API key - store this in an environment variable in production!
// Replace 'api' with your actual Claude API key
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || 'your_claude_api_key_here';

// Enable CORS for all routes - in production you might want to restrict this
app.use(cors());

// Increase payload size limit for image data
app.use(bodyParser.json({ limit: '50mb' }));

// Serve static files from the current directory
app.use(express.static('./'));

// Route to proxy requests to Claude API
app.post('/api/claude', async (req, res) => {
  try {
    console.log('Received request to generate 3D model');

    const { image, contentType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    if (!contentType) {
      return res.status(400).json({ error: 'No content type provided' });
    }

    console.log(`Processing image with content type: ${contentType}`);

    // Construct the prompt for Claude
    const prompt = `I have an image of a 3D object that I want to create a 3D model of using Three.js.
    Please analyze this image and create JavaScript code using Three.js that will recreate this object as a 3D model.

    The code should:
    1. Use geometric primitives (cubes, spheres, cylinders, etc.) to build the model
    2. Use appropriate colors and proportions based on the image
    3. Position all elements correctly relative to each other
    4. Be structured for easy integration with Three.js
    5. Include comments explaining each major component

    Important: Your response should ONLY include the JavaScript code needed to create the model, without any explanation or markdown formatting.
    The code should create geometry that can be used with Three.js's built-in STL exporter.
    Use the function 'addCube(x, y, z, width, height, depth, color)' as your primary building block for creating geometric shapes.
    Ensure all model parts are added to the scene object.

    If this is a Minecraft-style object, please use a blocky, voxel-based approach with cubes.`;

    console.log('Calling Claude API...');

    // Call Claude API
    const claudeResponse = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: contentType,
                  data: image
                }
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    console.log('Received response from Claude API');

    // Extract the code from Claude's response
    let modelCode = '';
    if (claudeResponse.data.content && claudeResponse.data.content.length > 0) {
      for (const content of claudeResponse.data.content) {
        if (content.type === 'text') {
          // Look for code blocks in the response
          const codeBlockRegex = /```(?:javascript|js)?\s*([\s\S]*?)```/g;
          const matches = content.text.matchAll(codeBlockRegex);

          for (const match of Array.from(matches)) {
            modelCode += match[1] + '\n';
          }

          // If no code blocks were found, use the entire text
          if (!modelCode.trim()) {
            modelCode = content.text;
          }
        }
      }
    }

    res.json({ modelCode });
  } catch (error) {
    console.error('Error calling Claude API:', error.message);
    if (error.response) {
      console.error('API Response data:', error.response.data);
    }

    res.status(500).json({
      error: 'Error calling Claude API',
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
});

// Simple test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ status: 'Server is running correctly' });
});

// Start the server
app.listen(port, () => {
  console.log(`Claude API proxy server running at http://localhost:${port}`);
  console.log(`Open http://localhost:${port} in your browser to access the application`);
});