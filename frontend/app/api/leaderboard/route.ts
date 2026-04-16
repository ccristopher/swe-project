import { auth } from "@clerk/nextjs/server";
import initSchemas from "../../../../backend/db/schema";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await auth();

  if (!session.userId) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const { users } = await initSchemas();

  const currentUser = await users.findOne({
    clerkUserId: session.userId,
  });

  if (!currentUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const friendIds = currentUser.friends || [];

  const friendObjectIds = friendIds.map((id: any) =>
    typeof id === "string" ? new ObjectId(id) : id
  );

  const leaderboard = await users
    .find({ _id: { $in: friendObjectIds } })
    .sort({ booksCompleted: -1 })
    .toArray();

  return Response.json({ leaderboard });
}