const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const utils = require('./utils.js')

const app = express();
const port = 3000;


app.use(express.static('public'));

// Saves UTC timestamp to a file
app.get('/saveTimestamp', async (req, res) => {
  const timestamp = new Date().toUTCString();
  const filePath = path.join(__dirname, 'timestamps.txt');

  try {
    await fs.appendFile(filePath, timestamp + '\n');
    console.log('Timestamp saved:', timestamp);
    res.json({ timestamp });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving timestamp to file');
  }
});


// Returns duration as a numerical value
app.get('/getAccumulatedDuration', async (req, res) => {
  const filePath = path.join(__dirname, 'accumulatedDuration.txt');

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const timestamps = data.trim().split('\n');
    const latestTimestamp = timestamps[timestamps.length - 1];

    res.json({ timestamp: latestTimestamp });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching timestamp from file');
  }
});


// Calculates duration between two UTC timestamps and saves duration to file
app.get('/saveAccumulatedDuration', async (req, res) => {
  const timestampNow = new Date().toUTCString();
  const filePath = path.join(__dirname, 'timestamps.txt');
  let previousTimestamp;

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const timestamps = data.trim().split('\n');
    previousTimestamp = timestamps[timestamps.length - 1];
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error fetching timestamp from file');
  }

  const previous = new Date(previousTimestamp);
  const now = new Date(timestampNow);

  // Calculate the time difference in milliseconds
  const timeDifference = now - previous;

  const accumulatedDurationFilePath = path.join(__dirname, 'accumulatedDuration.txt');

  try {
    await fs.appendFile(accumulatedDurationFilePath, timeDifference + '\n');
    console.log('Timestamp duration:', timeDifference);
    res.json({ timeDifference });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving timestamp to file');
  }
});

// Return timestamp
app.get('/getTimestamp', async (req, res) => {
  const timestamp = await utils.getLatestTimestamp();
  console.log(timestamp);
  res.json({ timestamp });
});

// Pause button: store the previously accumulated duration to a different file, 
// and check to see if that duration is empty prior to displaying time.
// If a person returns to the site and the accumlated duration file has a value, display that
// if user clicks start, then continue counting up from the current time + the accumulated duration
app.get('/updateTimestamp', async (req, res) => {
  const filePath = path.join(__dirname, 'timestamps.txt');

  try {
    await fs.appendFile(filePath, timestamp + '\n');
    console.log('Timestamp saved:', timestamp);
    res.json({ timestamp });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving timestamp to file');
  }
});




// Serve the HTML file at the root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});