import { NextResponse } from "next/server";
import connectDB from "../../../../../backend/db/mongo";

export async function PUT(req: Request) {
  try {
    const { quote, userId } = await req.json();

    const db = await connectDB();

    await db.collection("pets").updateOne(
      { ownerId: userId },
      { $set: { quote: quote } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 }
    );
  }
}