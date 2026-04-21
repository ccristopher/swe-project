import { auth } from '@clerk/nextjs/server';
import initSchemas from '@/lib/db/schema';
import { canMarkBookCompleted, shouldAutoCompleteBook, sumPagesFromBooks } from '@/lib/readingProgress';
import { buildUserProgressUpdate, rewardIdsForPagesGained } from '@/lib/levelRewards';
import { cleanEquippedItems, emptyEquippedItems, pruneEquippedItemsToUnlockedRewards } from '@/lib/petItems';
const COVER_API = "https://bookcover.longitood.com/bookcover";

function toPublicPath(value: unknown, fallback: string) {
  if (typeof value !== 'string' || !value.trim()) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith('/') ? value : `/${value}`;
}

export async function GET() {
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

    const history = await books.find({ ownerId: dbUser._id }).sort({ _id: -1 }).toArray();
    const normalizedBooks = history.map((book: any) => ({
      ...book,
      coverUrl: toPublicPath(book.coverUrl, '/defbookcover-min.jpg'),
    }));
    return new Response(JSON.stringify({ books: normalizedBooks }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new Response(JSON.stringify({ error: 'Not signed in' }), { status: 401 });
    }

    const body: any = await req.json();
    const title = typeof body?.title === 'string' ? body.title : '';
    const author = typeof body?.author === 'string' ? body.author : '';
    const genre = typeof body?.genre === 'string' ? body.genre : '';

    const isbn = typeof body?.isbn === 'string' ? body.isbn : '';

    const pageCount = Number(body?.pageCount);
    const pagesRead =
      body?.pagesRead !== undefined && Number.isFinite(Number(body.pagesRead)) && Number(body.pagesRead) >= 0
        ? Math.floor(Number(body.pagesRead))
        : 0;
    const requestedCompleted = body?.completed === true;
    const dnf = body?.dnf === true;

    if (!title || !author || !genre || !Number.isFinite(pageCount) || pageCount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid book fields (pageCount must be > 0)' }),
        { status: 400 }
      );
    }

    if (requestedCompleted && !canMarkBookCompleted({ numberOfPages: pageCount, pagesRead })) {
      return new Response(
        JSON.stringify({ error: 'Books can only be marked complete after at least 90% progress' }),
        { status: 400 }
      );
    }

    const { users, books, pets } = await initSchemas();
    const dbUser = await users.findOne({ clerkUserId: session.userId });
    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), { status: 404 });
    }

    const booksBefore = await books.find({ ownerId: dbUser._id }).toArray();
    const oldTotalPages = sumPagesFromBooks(booksBefore);

    let coverUrl = '/defbookcover-min.jpg';

    try {
      const coverRes = await fetch(
        `${COVER_API}?isbn=${isbn}&book_title=${encodeURIComponent(title)}&author_name=${encodeURIComponent(author)}`
      );

      if (coverRes.ok) {
        const data = await coverRes.json();
        coverUrl = toPublicPath(data?.url, '/defbookcover-min.jpg');
      }
    } catch (err) {
      console.log("Cover fetch failed:", err);
    }

    const result = await books.insertOne({
      ownerId: dbUser._id,
      name: title,
      author,
      genre,
      isbn,
      coverUrl,
      dnf,
      numberOfPages: Math.floor(pageCount),
      pagesRead,
      completed: dnf
        ? false
        : requestedCompleted
          ? true
          : shouldAutoCompleteBook({ numberOfPages: pageCount, pagesRead }),
    });

    const booksAfter = await books.find({ ownerId: dbUser._id }).toArray();
    const newTotalPages = sumPagesFromBooks(booksAfter);
    const newRewards = rewardIdsForPagesGained(oldTotalPages, newTotalPages);
    const userUpdate = buildUserProgressUpdate(oldTotalPages, booksAfter);
    await users.updateOne({ _id: dbUser._id }, userUpdate);
    const unlockedRewards = Array.isArray(userUpdate.$set.unlockedRewards)
      ? userUpdate.$set.unlockedRewards
      : [];

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

    return new Response(
      JSON.stringify({
        message: 'Book logged',
        bookId: result.insertedId,
        newLevelRewards: newRewards,
        unlockedRewards,
        pet: {
          equippedItems: cleanEquippedItems(equippedItems),
        },
      }),
      { status: 201 }
    );

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
