import connectDB from "@/lib/db/mongo";
import { ObjectId } from "mongodb";
import { getLevelFromTotalPages } from "@/lib/readingProgress";
import { cleanEquippedItems, emptyEquippedItems } from "@/lib/petItems";

function toPublicPath(value: unknown, fallback: string) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith("/") ? value : `/${value}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const db = await connectDB();

  const userQuery = ObjectId.isValid(userId)
    ? { $or: [{ clerkUserId: userId }, { _id: new ObjectId(userId) }] }
    : { clerkUserId: userId };

  const user = await db.collection("users").findOne(userQuery);

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const pet = await db.collection("pets").findOne({
    ownerId: user._id,
  });

  const books = await db.collection("books").find({ ownerId: user._id }).toArray();

  const normalizedPet = pet
    ? {
        ...pet,
        imageID: toPublicPath(pet.imageID, "/gator....png"),
        equippedItems: cleanEquippedItems(pet.equippedItems),
      }
    : {
        imageID: "/gator....png",
        equippedItems: emptyEquippedItems(),
      };

  const normalizedBooks = books.map((book: any) => ({
    ...book,
    coverUrl: toPublicPath(book.coverUrl, "/defbookcover-min.jpg"),
  }));

  const totalPagesRead = Number.isFinite(Number(user.totalPagesRead))
    ? Math.max(0, Math.floor(Number(user.totalPagesRead)))
    : 0;
  const booksCompleted = Number.isFinite(Number(user.booksCompleted))
    ? Math.max(0, Math.floor(Number(user.booksCompleted)))
    : 0;
  const level = getLevelFromTotalPages(totalPagesRead);

  const rawFriends = user.friends || [];
  let rank = 1;
  if (rawFriends.length > 0) {
    const friendObjectIds = rawFriends.map((id: unknown) => {
      if (typeof id === "string" && ObjectId.isValid(id)) return new ObjectId(id);
      return id;
    });
    const peers = await db
      .collection("users")
      .find({ _id: { $in: friendObjectIds } })
      .toArray();
    const higher = peers.filter(
      (p: { booksCompleted?: number }) =>
        Number(p.booksCompleted || 0) > booksCompleted
    ).length;
    rank = higher + 1;
  }

  const userOut = {
    ...user,
    totalPagesRead,
    booksCompleted,
    rank,
  };

  return Response.json({
    user: userOut,
    pet: normalizedPet,
    books: normalizedBooks,
    level,
  });
}
