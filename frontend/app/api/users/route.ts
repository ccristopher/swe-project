import { auth, clerkClient } from "@clerk/nextjs/server";
import initSchemas from "@/lib/db/schema";

function sanitizeUsername(input: unknown): string | null {
  if (typeof input !== "string") return null;

  const username = input.trim();

  if (!username) return null;
  if (username.startsWith("$")) return null;
  if (username.includes(".")) return null;
  if (username.length > 30) return null;

  return username;
}

export async function POST() {
  try {
    const session = await auth();

    if (!session.userId) {
      return new Response(JSON.stringify({ error: "Not signed in" }), {
        status: 401,
      });
    }

    const user = await (await clerkClient()).users.getUser(session.userId);
    const { users } = await initSchemas();

    // Check if user already exists
    let dbUser = await users.findOne({ clerkUserId: session.userId });

    if (dbUser) {
      return new Response(
        JSON.stringify({ message: "User exists", user: dbUser })
      );
    }
    const displayName =
      user.username ||
      user.firstName ||
      user.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
      `user_${session.userId.slice(-4)}`;

    const newUser = {
      clerkUserId: session.userId,
      username: displayName,
      email:
        user.emailAddresses?.[0]?.emailAddress || "no-email@example.com",
      createdAt: new Date(),
      onboardingCompleted: false,
    };

    const result = await users.insertOne(newUser);

    console.log("Inserted user:", newUser);

    return new Response(
      JSON.stringify({
        message: "User added",
        userId: result.insertedId,
      })
    );
  } catch (err: any) {
    console.error("Error inserting user:", err);

    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session.userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const username = sanitizeUsername(body.username);

    if (!username) {
      return Response.json({ error: "Invalid username" }, { status: 400 });
    }

    const { users } = await initSchemas();
    const currentUser = await users.findOne({ clerkUserId: session.userId });

    if (!currentUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const existingUser = await users.findOne({ username });

    if (existingUser && !existingUser._id.equals(currentUser._id)) {
      return Response.json({ error: "Username is already taken" }, { status: 409 });
    }

    await users.updateOne(
      { _id: currentUser._id },
      { $set: { username } }
    );

    return Response.json({ ok: true, username });
  } catch (err: any) {
    console.error("Error updating username:", err);

    return Response.json(
      { error: err.message || "Failed to update username" },
      { status: 500 }
    );
  }
}
