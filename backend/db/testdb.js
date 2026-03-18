const initSchemas = require('./schema');
const connectDB = require('./mongo');

async function testDB() {
  const db = await connectDB();
  const { users, pets, books, items } = await initSchemas();

  // Insert a test user
  const userResult = await users.insertOne({
    username: "rawan_test",
    password: "hashedPassword123", 
    email: "rawan_test@example.com",
    createdAt: new Date()
  });
  const userId = userResult.insertedId;
  console.log("Inserted user with _id:", userId);

  // Insert a pet for this user
  const petResult = await pets.insertOne({
    name: "Fluffy",
    type: "Dog",
    ownerId: userId,
    imageID: "fluffy.png"
  });
  console.log("Inserted pet:", petResult.insertedId);

  // Insert a book for this user
  const bookResult = await books.insertOne({
    name: "My Favorite Book",
    author: "Author Name",
    genre: "Fiction",
    completed: false,
    numberOfPages: 250,
    ownerId: userId
  });
  console.log("Inserted book:", bookResult.insertedId);

  // Insert an item for this user
  const itemResult = await items.insertOne({
    name: "Toy Bone",
    description: "A chew toy for Fluffy",
    imageID: "toy_bone.png",
    ownerId: userId
  });
  console.log("Inserted item:", itemResult.insertedId);

  // Query everything for this user
  const userPets = await pets.find({ ownerId: userId }).toArray();
  console.log("Pets for user:", userPets);

  const userBooks = await books.find({ ownerId: userId }).toArray();
  console.log("Books for user:", userBooks);

  const userItems = await items.find({ ownerId: userId }).toArray();
  console.log("Items for user:", userItems);

}

testDB().catch(err => console.error(err));