//connecting to mongodb and starting express server

const express = require('express');
const connectToMongo = require('./db/mongo');

const app = express();
const PORT = 3000;

async function startServer() {
  try {
    await connectToMongo();

    app.get('/', (req, res) => {
      res.send('Backend is running!');
    });

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();