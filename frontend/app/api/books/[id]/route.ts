import { auth } from '@clerk/nextjs/server';
import initSchemas from '../../../../../backend/db/schema';
import { ObjectId } from 'mongodb';
import { sumPagesFromBooks } from '@/lib/readingProgress';
import { buildUserProgressUpdate } from '@/lib/levelRewards';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new Response(JSON.stringify({ error: 'Not signed in' }), { status: 401 });
    }

    const { users, books } = await initSchemas();
    const dbUser = await users.findOne({ clerkUserId: session.userId });
    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), { status: 404 });
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid book id' }), { status: 400 });
    }

    const body: any = await req.json();
    const updateDoc: any = {};

    if (typeof body?.title === 'string' && body.title) updateDoc.name = body.title;
    if (typeof body?.author === 'string' && body.author) updateDoc.author = body.author;
    if (typeof body?.genre === 'string' && body.genre) updateDoc.genre = body.genre;
    if (typeof body?.review === "string") {
      updateDoc.review = body.review;
    }
    
    if (body?.pagesRead !== undefined) {
      const pagesRead = Number(body.pagesRead);
      if (!Number.isFinite(pagesRead) || pagesRead < 0) {
        return new Response(JSON.stringify({ error: 'pagesRead must be a non-negative number' }), {
          status: 400,
        });
      }
      updateDoc.pagesRead = Math.floor(pagesRead);
    }
    
    if (typeof body?.finishedAt === "string") {
      updateDoc.finishedAt = new Date(body.finishedAt);
    }
    if (body?.pageCount !== undefined) {
      const pageCount = Number(body.pageCount);
      if (!Number.isFinite(pageCount) || pageCount <= 0) {
        return new Response(JSON.stringify({ error: 'pageCount must be a positive number' }), {
          status: 400,
        });
      }
      updateDoc.numberOfPages = Math.floor(pageCount);
    }
    if (typeof body?.completed === 'boolean') updateDoc.completed = body.completed;

    if (Object.keys(updateDoc).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields were provided to update' }), {
        status: 400,
      });
    }

    const booksBefore = await books.find({ ownerId: dbUser._id }).toArray();
    const oldTotalPages = sumPagesFromBooks(booksBefore);

    const result = await books.updateOne(
      { _id: new ObjectId(id), ownerId: dbUser._id },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
    }

    const booksAfter = await books.find({ ownerId: dbUser._id }).toArray();
    const userUpdate = buildUserProgressUpdate(oldTotalPages, booksAfter);
    await users.updateOne({ _id: dbUser._id }, userUpdate);

    const newRewards = userUpdate.$addToSet?.unlockedRewards.$each ?? [];

    return new Response(
      JSON.stringify({ message: 'Book updated', newLevelRewards: newRewards }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new Response(JSON.stringify({ error: 'Not signed in' }), { status: 401 });
    }

    const { users, books } = await initSchemas();
    const dbUser = await users.findOne({ clerkUserId: session.userId });
    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), { status: 404 });
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid book id' }), { status: 400 });
    }

    const booksBefore = await books.find({ ownerId: dbUser._id }).toArray();
    const oldTotalPages = sumPagesFromBooks(booksBefore);

    const result = await books.deleteOne({
      _id: new ObjectId(id),
      ownerId: dbUser._id,
    });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
    }

    const booksAfter = await books.find({ ownerId: dbUser._id }).toArray();
    const userUpdate = buildUserProgressUpdate(oldTotalPages, booksAfter);
    await users.updateOne({ _id: dbUser._id }, userUpdate);

    const newRewards = userUpdate.$addToSet?.unlockedRewards.$each ?? [];

    return new Response(
      JSON.stringify({ message: 'Book deleted', newLevelRewards: newRewards }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
