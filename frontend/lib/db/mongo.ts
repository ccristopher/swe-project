import { MongoClient, ServerApiVersion } from "mongodb";

const DEFAULT_DB_NAME = "pet_n_prose";
const DEFAULT_CLUSTER_HOST = "cluster0.pfigh3v.mongodb.net";

let clientPromise: Promise<MongoClient> | undefined;
let dbPromise: Promise<any> | undefined;

function getDbName() {
  return process.env.DB_NAME || DEFAULT_DB_NAME;
}

function getMongoUri() {
  const directUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (directUri) return directUri;

  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;

  if (!dbUser || !dbPassword) {
    throw new Error(
      "Missing MongoDB configuration. Set MONGODB_URI or both DB_USER and DB_PASSWORD."
    );
  }

  const host = process.env.DB_HOST || DEFAULT_CLUSTER_HOST;

  return `mongodb+srv://${encodeURIComponent(dbUser)}:${encodeURIComponent(
    dbPassword
  )}@${host}/${getDbName()}?retryWrites=true&w=majority&authSource=admin`;
}

function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(getMongoUri(), {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    clientPromise = client.connect();
  }

  return clientPromise;
}

export default async function connectDB(): Promise<any> {
  if (!dbPromise) {
    dbPromise = getClient().then((client) => client.db(getDbName()));
  }

  return dbPromise;
}
