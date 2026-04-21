import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import initSchemas from "@/lib/db/schema";
import { clampQuote } from "@/lib/quoteUtils";

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const quote = clampQuote(typeof body.quote === "string" ? body.quote : "");

    const { users, pets } = await initSchemas();
    const user = await users.findOne({ clerkUserId: session.userId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await pets.updateOne(
      { ownerId: user._id },
      { $set: { quote } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "No pet found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, quote });
  } catch {
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 }
    );
  }
}
