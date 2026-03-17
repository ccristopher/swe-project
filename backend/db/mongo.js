const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pfigh3v.mongodb.net/pet_prose?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    console.log("Connected to MongoDB!");
    await client.db("pet_n_prose").command({ ping: 1 });
    console.log("Pinged your deployment successfully!");

    const db = client.db("pet_n_prose");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections);

  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();

async function connectDB() {
  await client.connect();
  return client.db('pet_prose');
}

module.exports = connectDB;