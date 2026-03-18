require('dotenv').config({ debug: true });
const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pfigh3v.mongodb.net/pet_n_prose?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  if (!client.isConnected?.()) await client.connect(); // connect if not already
  return client.db('pet_n_prose');
}

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
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

// Run test if called directly
if (require.main === module) testConnection();

module.exports = connectDB;