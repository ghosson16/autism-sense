const { PythonShell } = require('python-shell');
const path = require('path');

const detectEmotion = (base64Image, res) => {
  const scriptPath = path.resolve(__dirname, '../emotionDetection.py');

  const options = {
    mode: 'text',
    pythonOptions: ['-u'], // Unbuffered output (immediate responses)
  };

  const pyshell = new PythonShell(scriptPath, options);

// Send the base64-encoded image via stdin to the Python script
pyshell.send(base64Image);


  // Listen for messages from the Python script
  pyshell.on('message', (message) => {
    console.log('Emotion detected:', message);
    res.json({ emotion: message });
  });

  // Handle any errors
  pyshell.on('error', (err) => {
    console.error('Error running Python script:', err);
    res.status(500).json({ message: 'Error detecting emotion' });
  });

  // End the PythonShell and handle completion
  pyshell.end((err) => {
    if (err) {
      console.error('Error during PythonShell execution');
    }
  });
};

module.exports = detectEmotion;
