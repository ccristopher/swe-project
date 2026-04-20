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
        createdAt: { bsonType: "date" },
        friends: {
          bsonType: "array",
          items: { bsonType: "objectId" },
          description: "list of friend user IDs"
        }, 
        onboardingCompleted: { bsonType: "bool" },
        monthlyGoalTargetPages: { bsonType: "int" },
        totalPagesRead: { bsonType: "int" },
        booksCompleted: { bsonType: "int" },
        unlockedRewards: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "reward ids earned by reaching pet levels (e.g. lvl-2)"
        }
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
        name: { bsonType: "string" },
        type: { bsonType: "string" },
        ownerId: { bsonType: "objectId" },
        imageID: { bsonType: "string" },
        quote: { bsonType: "string" },
        equippedItems: {
          bsonType: "object",
          properties: {
            head: { bsonType: ["string", "null"] },
            neck: { bsonType: ["string", "null"] },
            treat: { bsonType: ["string", "null"] }
          }
        }
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
        isbn: { bsonType: "string" },
        coverURL: { bsonType: "string", description: "must be a URL string" },
        completed: { bsonType: "bool", description: "must be a boolean" },
        dnf: { bsonType: "bool", description: "must be a boolean" },
        review: { bsonType: "string" },
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

let schemasPromise;

// Initialize collections with validation once per warm server process.
async function initSchemas() {
  if (!schemasPromise) {
    schemasPromise = (async () => {
      const db = await connectDB();

      const users = await db.createCollection('users', userSchema).catch(() => db.collection('users'));
      const pets = await db.createCollection('pets', petsSchema).catch(() => db.collection('pets'));
      const books = await db.createCollection('books', booksSchema).catch(() => db.collection('books'));
      const items = await db.createCollection('items', itemsSchema).catch(() => db.collection('items'));

      return { users, pets, books, items };
    })();
  }

  return schemasPromise;
}

module.exports = initSchemas;
