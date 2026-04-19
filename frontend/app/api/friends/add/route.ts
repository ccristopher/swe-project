import { auth } from "@clerk/nextjs/server";
import initSchemas from "../../../../../backend/db/schema";

function sanitizeUsername(input: unknown): string | null {
  if (typeof input !== "string") return null;

  const username = input.trim();

  if (!username) return null;
  if (username.startsWith("$")) return null;
  if (username.includes(".")) return null;
  if (username.length > 30) return null;

  return username;
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session.userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const friendUsername = sanitizeUsername(body.friendUsername);

    if (!friendUsername) {
      return Response.json({ error: "Invalid username" }, { status: 400 });
    }

    const { users } = await initSchemas();

    const currentUser = await users.findOne({
      clerkUserId: session.userId,
    });

    if (!currentUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // prevent self-friend
    if (currentUser.username === friendUsername) {
      return Response.json(
        { error: "You can't add yourself" },
        { status: 400 }
      );
    }

    const friend = await users.findOne({
      username: friendUsername,
    });

    if (!friend) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    await users.updateOne(
      { _id: currentUser._id },
      {
        $addToSet: {
          friends: friend._id,
        },
      }
    );

    return Response.json({ message: "Friend added!" });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}