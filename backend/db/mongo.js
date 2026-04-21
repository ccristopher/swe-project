const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

// Load mongodb/dotenv from the package that owns node_modules for this process:
// - Next/Vercel: cwd is frontend/
// - backend/server.js: cwd is usually backend/
// Plain require() from this file fails under Turbopack because resolution starts under backend/db/.
const requireApp = createRequire(path.join(process.cwd(), 'package.json'));

const envCandidates = [
  path.resolve(process.cwd(), '..', 'backend', '.env'),
  path.resolve(process.cwd(), 'backend', '.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '..', '.env'),
];
for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    requireApp('dotenv').config({ path: envPath });
    break;
  }
}

const { MongoClient, ServerApiVersion } = requireApp('mongodb');

const dbUser = encodeURIComponent(process.env.DB_USER || '');
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD || '');

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.pfigh3v.mongodb.net/pet_n_prose?retryWrites=true&w=majority&authSource=admin`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbPromise;

async function connectDB() {
  if (!dbPromise) {
    dbPromise = client.connect().then(() => {
      console.log("MongoDB connected");
      return client.db('pet_n_prose');
    });
  }

  return dbPromise;
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
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}

if (require.main === module) testConnection();
