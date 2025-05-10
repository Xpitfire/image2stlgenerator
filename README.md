# 3D Model Generator from Images

This application allows you to generate 3D models from images using Claude AI. Upload an image, and Claude will analyze it and create a Three.js model that can be exported for 3D printing.

## Quick Start Guide

### Step 1: Set up Node.js environment
1. Make sure you have [Node.js](https://nodejs.org/) installed on your computer
2. Clone this repository or download the files
3. Open a terminal/command prompt in the project folder

### Step 2: Install required Node.js packages
Run the following commands in your terminal:

```bash
npm init -y
npm install express cors axios body-parser
```

### Step 3: Set up your Claude API key
1. Open the `server.js` file
2. Replace `'your_claude_api_key_here'` with your actual Claude API key
3. For better security, consider using an environment variable:
   ```bash
   # On Windows
   set CLAUDE_API_KEY=your_api_key_here

   # On macOS/Linux
   export CLAUDE_API_KEY=your_api_key_here
   ```

### Step 4: Start the server
In your terminal, run:

```bash
node server.js
```

You should see: `Claude API proxy server running at http://localhost:3000`

### Step 5: Use the application
1. Open a web browser and navigate to: `http://localhost:3000`
2. Upload an image of an object you want to create a 3D model of
3. Click "Generate 3D Model"
4. Once processing is complete, you can view the 3D model and download it as an STL file

## Troubleshooting

### Common Issues and Solutions

- **"Cannot connect to backend server"**: Make sure the server is running on http://localhost:3000
- **"Error calling Claude API"**: Check that you've entered your API key correctly
- **"Image does not match the provided media type"**: This should be handled by the application, but ensure you're uploading valid image files
- **No model appears after generation**: Check the debug logs by clicking "Show Debug Logs"
- **Error on download**: Make sure the model was successfully generated before attempting to download

### Debug Logs

The application includes a debug logging feature. Click "Show Debug Logs" at the bottom of the page to view detailed information about the application's operation. This can be helpful for troubleshooting issues.

## How It Works

1. The frontend allows you to upload an image
2. The image is sent to a local backend server
3. The backend server forwards the image to Claude API with a prompt to generate 3D model code
4. Claude analyzes the image and generates Three.js code
5. The backend sends the code back to the frontend
6. The frontend renders the 3D model using Three.js
7. You can download the model as an STL file for 3D printing

## Technical Details

### Frontend
- HTML, CSS, JavaScript
- Three.js for 3D rendering
- Custom STL exporter for 3D model download

### Backend
- Node.js with Express
- Proxy server to bypass CORS restrictions
- Interfaces with Claude API for image analysis

## For Production Use

For a production environment, you would need to:

1. Host the backend on a proper server (Heroku, AWS, etc.)
2. Store the API key in environment variables
3. Implement proper error handling and logging
4. Add rate limiting and security measures
5. Consider adding user authentication

This simple setup is intended for local development and testing.