import { NextResponse } from "next/server";
import connectDB from "../../../../../backend/db/mongo";
import { ObjectId } from "mongodb";

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
      }
    : null;

  const normalizedBooks = books.map((book: any) => ({
    ...book,
    coverUrl: toPublicPath(book.coverUrl, "/defbookcover-min.jpg"),
  }));

  return Response.json({ user, pet: normalizedPet, books: normalizedBooks });
}
