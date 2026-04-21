/**
* Hello this is Avi Patel aka firedog 1234
* I worked on an existing API route originally written and updated it to improve
* the implementation, including replacing the original request-based userId approach with Clerk
* authentication  and use the database user _id
* I then told Cursor to review my which refactored the route structure, cleaned up database access
* using initSchemas instead of direct DB calls, and improved consistency in validation and changes some of the messages
*
* it also made some other change in some other file like formatting and it added some random md change for some reason
* but i was using like 'git add .' unfortunately. oops
*/

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
