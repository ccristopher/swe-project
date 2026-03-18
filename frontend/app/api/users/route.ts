import { auth, clerkClient } from '@clerk/nextjs/server';
import initSchemas from '../../../../backend/db/schema';


export async function POST() {
  try {
    const session = await auth();
    if (!session.userId) return new Response(JSON.stringify({ error: 'Not signed in' }), { status: 401 });

    const user = await (await clerkClient()).users.getUser(session.userId);

    const { users, pets, books, items } = await initSchemas();

    // Check if user already exists
    let dbUser = await users.findOne({ clerkUserId: session.userId });
    if (dbUser) return new Response(JSON.stringify({ message: 'User exists', user: dbUser }));

    // Map Clerk data to Mongo schema
    const newUser = {
      clerkUserId: session.userId,
      username: user.username || `User-${session.userId.slice(0, 6)}`,
      email: user.emailAddresses?.[0]?.emailAddress || 'no-email@example.com',
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    const userId = result.insertedId;

    console.log('Inserted user:', newUser);

    // test: insert a pet for this user
    const petResult = await pets.insertOne({
      name: 'Fluffy',
      type: 'Dog',
      ownerId: userId,
      imageID: 'fluffy.png',
    });

    return new Response(JSON.stringify({ message: 'User added', userId, petId: petResult.insertedId }));
  } catch (err: any) {
    console.error('Error inserting user:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}