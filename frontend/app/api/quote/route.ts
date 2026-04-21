import { auth } from "@clerk/nextjs/server";
import initSchemas from "@/lib/db/schema";

const MAX_CHARS = 300;

function sanitizeQuote(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, MAX_CHARS);
}

function stripMongoOperators(obj: any): any {
  if (Array.isArray(obj)) return obj.map(stripMongoOperators);

  if (obj && typeof obj === "object") {
    const clean: any = {};

    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) continue;
      clean[key] = stripMongoOperators(obj[key]);
    }

    return clean;
  }

  return obj;
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session.userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const safeBody = stripMongoOperators(body);

    const quote = sanitizeQuote(safeBody.quote);

    if (!quote) {
      return Response.json({ error: "Invalid quote" }, { status: 400 });
    }

    const { users, pets } = await initSchemas();

    const user = await users.findOne({
      clerkUserId: session.userId,
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const result = await pets.updateOne(
      { ownerId: user._id },
      { $set: { quote } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "Pet not found" }, { status: 404 });
    }

    return Response.json({ quote });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
