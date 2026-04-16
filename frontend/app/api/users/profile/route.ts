import { NextResponse } from "next/server";
import connectDB from "../../../../../backend/db/mongo";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
  
    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }
  
    const db = await connectDB();
  
    const user = await db.collection("users").findOne({
      clerkUserId: userId
    });
  
    const pet = await db.collection("pets").findOne({
      ownerId: userId
    });
  
    const books = await db.collection("books")
      .find({ ownerId: userId })
      .toArray();
  
    return Response.json({ user, pet, books });
  }