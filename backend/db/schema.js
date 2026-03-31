const connectDB = require('./mongo');

// Validation schemas
const userSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["clerkUserId", "createdAt"], 
      properties: {
        clerkUserId: { bsonType: "string" },
        username: { bsonType: "string" },
        email: { 
          bsonType: "string", 
          pattern: "^.+@.+$", 
          description: "must be a valid email" 
        },
        createdAt: { bsonType: "date" }
      }
    }
  }
};

const petsSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "ownerId"],
      properties: {
        name: { bsonType: "string", description: "must be a string and is required" },
        type: { bsonType: "string", description: "must be a string and is required" },
        ownerId: { bsonType: "objectId", description: "must be an ObjectId and is required" },
        imageID: { bsonType: "string", description: "must be an image path" }
      }
    }
  }
};

const booksSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ownerId", "name", "author"],
      properties: {
        ownerId: { bsonType: "objectId", description: "must be an ObjectId" },
        name: { bsonType: "string", description: "must be a string" },
        author: { bsonType: "string", description: "must be a string" },
        genre: { bsonType: "string", description: "must be a string" },
        completed: { bsonType: "bool", description: "must be a boolean" },
        numberOfPages: { bsonType: "int", description: "must be an integer" }
      }
    }
  }
};

const itemsSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ownerId", "name"],
      properties: {
        ownerId: { bsonType: "objectId", description: "must be an ObjectId" },
        name: { bsonType: "string", description: "must be a string" },
        description: { bsonType: "string", description: "must be a string" },
        imageID: { bsonType: "string", description: "must be an image path" }
      }
    }
  }
};

const { ObjectId } = require('mongodb');

async function initSchemas() {
  const db = await connectDB();

  const users = await db.createCollection('users', userSchema).catch(() => db.collection('users'));
  const pets = await db.createCollection('pets', petsSchema).catch(() => db.collection('pets'));
  const books = await db.createCollection('books', booksSchema).catch(() => db.collection('books'));
  const items = await db.createCollection('items', itemsSchema).catch(() => db.collection('items'));

  return { users, pets, books, items };
}

initSchemas.ObjectId = ObjectId;

module.exports = initSchemas;