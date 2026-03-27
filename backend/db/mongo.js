const path = require('path');

require('dotenv').config({
  path: path.resolve(process.cwd(), '../backend/.env'),
});

const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pfigh3v.mongodb.net/pet_n_prose?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('pet_n_prose');
    console.log("MongoDB connected");
  }
  return db;
}

module.exports = connectDB;

async function testConnection() {
  try {
    const db = await connectDB();
    console.log("Connected to MongoDB!");

    // Ping
    await db.command({ ping: 1 });
    console.log("Ping successful!");

    // List collections
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    console.log('Users collection:', usersCollection);
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}

// Run test if called directly
if (require.main === module) testConnection();

module.exports = connectDB;
