import { auth } from '@clerk/nextjs/server';
import initSchemas from '../../../../backend/db/schema';
const COVER_API = "https://bookcover.longitood.com/bookcover";

export async function GET() {
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

    const history = await books.find({ ownerId: dbUser._id }).sort({ _id: -1 }).toArray();
    return new Response(JSON.stringify({ books: history }), { status: 200 });
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
    const completed = typeof body?.completed === 'boolean' ? body.completed : true;

    if (!title || !author || !genre || !Number.isFinite(pageCount) || pageCount < 0) {
      return new Response(JSON.stringify({ error: 'Missing or invalid book fields' }), { status: 400 });
    }

    const { users, books } = await initSchemas();
    const dbUser = await users.findOne({ clerkUserId: session.userId });
    if (!dbUser) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), { status: 404 });
    }

    const COVER_API = "https://bookcover.longitood.com/bookcover";

    let coverUrl = "";

    try {
      const coverRes = await fetch(
        `${COVER_API}?isbn=${isbn}&book_title=${encodeURIComponent(title)}&author_name=${encodeURIComponent(author)}`
      );

      if (coverRes.ok) {
        const data = await coverRes.json();
        coverUrl = data.url || "../../../../public/defbookcover-min.jpg";
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
      numberOfPages: Math.floor(pageCount),
      completed,
    });

    return new Response(JSON.stringify({ message: 'Book logged', bookId: result.insertedId }), {
      status: 201,
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}