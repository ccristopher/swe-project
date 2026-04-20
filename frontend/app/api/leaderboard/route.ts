import { auth } from "@clerk/nextjs/server";
import initSchemas from "../../../../backend/db/schema";
import { ObjectId } from "mongodb";
import { cleanEquippedItems, emptyEquippedItems } from "@/lib/petItems";

function toPublicPath(value: unknown, fallback: string) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith("/") ? value : `/${value}`;
}

export async function GET() {
  const session = await auth();

  if (!session.userId) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const { users, pets } = await initSchemas();

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

  const allIds = [
    currentUser._id,
    ...friendObjectIds,
  ];

  const leaderboard = await users
    .find({ _id: { $in: allIds } })
    .sort({ booksCompleted: -1 })
    .toArray();

  const petDocs = await pets
    .find({
      ownerId: { $in: allIds },
    })
    .toArray();

  const leaderboardWithPets = leaderboard.map((leaderboardUser: any) => {
    const pet = petDocs.find((p: any) => String(p.ownerId) === String(leaderboardUser._id));
    const petOut = pet
      ? {
          imageID: toPublicPath(pet.imageID, "/gator....png"),
          equippedItems: cleanEquippedItems(pet.equippedItems),
        }
      : {
          imageID: "/gator....png",
          equippedItems: emptyEquippedItems(),
        };

    return {
      ...leaderboardUser,
      pet: petOut,
      petImage: petOut.imageID,
    };
  });

  return Response.json({ leaderboard: leaderboardWithPets });
}
