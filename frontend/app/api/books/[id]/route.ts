/** Hello this is Avi Patel aka firedog 1234)=
* NOTE: this applies to both files books/route.ts and books/[id]/route.ts so i'll put it in both files
*
* I used Cursor to generate the base API routes for handling books get post patch delete,
* then edited  some stuff.
*
* I added auth checks to make sure the user is signed in and ensured users can only access
* their own books using ownerId
*  I added validation for inputs like title, author, genre,
* and pageCount and some validation for those,
* and handled errors with status codes.
*
* I also updated how fields map to the database title to name, pageCount to numberOfPages
* made the PATCH route only update provided fields instead of overwriting everything,
* and added sorting to the GET route so newer books show first.
*
* https://www.sohamkamani.com/typescript/rest-http-api-call/
*/


import { auth } from '@clerk/nextjs/server';
import initSchemas from '@/lib/db/schema';
import { ObjectId } from 'mongodb';
import { canMarkBookCompleted, shouldAutoCompleteBook, sumPagesFromBooks } from '@/lib/readingProgress';
import { buildUserProgressUpdate } from '@/lib/levelRewards';
import { cleanEquippedItems, emptyEquippedItems, pruneEquippedItemsToUnlockedRewards } from '@/lib/petItems';

function toPublicPath(value: unknown, fallback: string) {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith('/') ? value : `/${value}`;
}

function toResponseBook(book: any) {
  return {
    _id: typeof book?._id?.toString === 'function' ? book._id.toString() : String(book?._id ?? ''),
    author: typeof book?.author === 'string' ? book.author : '',
    completed: Boolean(book?.completed),
    coverUrl: toPublicPath(book?.coverUrl, '/defbookcover-min.jpg'),
    dnf: Boolean(book?.dnf),
    imageSrc: toPublicPath(book?.coverUrl, '/defbookcover-min.jpg'),
    name: typeof book?.name === 'string' ? book.name : '',
    numberOfPages: Number.isFinite(Number(book?.numberOfPages)) ? Math.max(0, Math.floor(Number(book.numberOfPages))) : 0,
    pagesRead: Number.isFinite(Number(book?.pagesRead)) ? Math.max(0, Math.floor(Number(book.pagesRead))) : 0,
    review: typeof book?.review === 'string' ? book.review : '',
    title: typeof book?.name === 'string' ? book.name : '',
  };
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new Response(JSON.stringify({ error: 'Not signed in' }), { status: 401 });
    }

    const { users, books, pets } = await initSchemas();
    const dbUser = await users.findOne({ clerkUserId: session.userId });
    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), { status: 404 });
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid book id' }), { status: 400 });
    }

    const existingBook = await books.findOne({ _id: new ObjectId(id), ownerId: dbUser._id });
    if (!existingBook) {
      return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
    }

    const body: any = await req.json();
    const updateDoc: any = {};
    let nextPagesRead = Number.isFinite(Number(existingBook.pagesRead)) ? Math.max(0, Math.floor(Number(existingBook.pagesRead))) : 0;
    let nextPageCount = Number.isFinite(Number(existingBook.numberOfPages))
      ? Math.max(0, Math.floor(Number(existingBook.numberOfPages)))
      : 0;
    let nextCompleted = Boolean(existingBook.completed);
    let nextDnf = Boolean(existingBook.dnf);

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
      nextPagesRead = Math.floor(pagesRead);
      updateDoc.pagesRead = nextPagesRead;
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
      nextPageCount = Math.floor(pageCount);
      updateDoc.numberOfPages = nextPageCount;
    }
    if (typeof body?.dnf === 'boolean') {
      nextDnf = body.dnf;
    }

    if (typeof body?.completed === 'boolean') {
      if (body.completed && !canMarkBookCompleted({ numberOfPages: nextPageCount, pagesRead: nextPagesRead })) {
        return new Response(
          JSON.stringify({ error: 'Books can only be marked complete after at least 90% progress' }),
          { status: 400 }
        );
      }

      nextCompleted = body.completed;

      if (body.completed) {
        nextDnf = false;
      }
    } else if (!nextDnf) {
      nextCompleted = shouldAutoCompleteBook({ numberOfPages: nextPageCount, pagesRead: nextPagesRead });
    }

    if (nextDnf) {
      nextCompleted = false;
    }

    updateDoc.completed = nextCompleted;
    updateDoc.dnf = nextDnf;

    if (Object.keys(updateDoc).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields were provided to update' }), {
        status: 400,
      });
    }

    const booksBefore = await books.find({ ownerId: dbUser._id }).toArray();
    const oldTotalPages = sumPagesFromBooks(booksBefore);

    await books.updateOne(
      { _id: new ObjectId(id), ownerId: dbUser._id },
      { $set: updateDoc }
    );

    const booksAfter = await books.find({ ownerId: dbUser._id }).toArray();
    const userUpdate = buildUserProgressUpdate(oldTotalPages, booksAfter);
    await users.updateOne({ _id: dbUser._id }, userUpdate);
    const unlockedRewards = Array.isArray(userUpdate.$set.unlockedRewards)
      ? userUpdate.$set.unlockedRewards
      : [];
    const userProgress = {
      booksCompleted: Number.isFinite(Number(userUpdate.$set.booksCompleted))
        ? Math.max(0, Math.floor(Number(userUpdate.$set.booksCompleted)))
        : 0,
      totalPagesRead: Number.isFinite(Number(userUpdate.$set.totalPagesRead))
        ? Math.max(0, Math.floor(Number(userUpdate.$set.totalPagesRead)))
        : 0,
    };
    const pet = await pets.findOne({ ownerId: dbUser._id });
    const equippedItems = pet
      ? pruneEquippedItemsToUnlockedRewards(pet.equippedItems, unlockedRewards)
      : emptyEquippedItems();

    if (pet) {
      await pets.updateOne(
        { ownerId: dbUser._id },
        {
          $set: {
            equippedItems,
          },
        }
      );
    }

    const newRewards = userUpdate.$addToSet?.unlockedRewards.$each ?? [];
    const updatedBook = booksAfter.find((book: any) => {
      const candidateId = typeof book?._id?.toString === 'function' ? book._id.toString() : String(book?._id ?? '');
      return candidateId === id;
    });

    return new Response(
      JSON.stringify({
        message: 'Book updated',
        newLevelRewards: newRewards,
        book: updatedBook ? toResponseBook(updatedBook) : null,
        unlockedRewards,
        userProgress,
        pet: {
          equippedItems: cleanEquippedItems(equippedItems),
        },
      }),
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

    const result = await books.deleteOne({
      _id: new ObjectId(id),
      ownerId: dbUser._id,
    });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Book not found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        message: 'Book deleted',
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
