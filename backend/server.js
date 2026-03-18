const express = require('express');
const connectToMongo = require('./db/mongo');

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectToMongo();

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});