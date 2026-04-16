import { auth } from "@clerk/nextjs/server";
import initSchemas from "../../../../../backend/db/schema";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const session = await auth();
  if (!session.userId) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const { friendUsername } = await req.json();

  const { users } = await initSchemas();

  const currentUser = await users.findOne({ clerkUserId: session.userId });
  const friend = await users.findOne({ username: friendUsername });

  if (!friend) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  await users.updateOne(
    { _id: currentUser._id },
    { $addToSet: { friends: friend._id } }
  );

  return Response.json({ message: "Friend added!" });
}