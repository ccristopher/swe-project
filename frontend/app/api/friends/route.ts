import { auth } from "@clerk/nextjs/server";
import initSchemas from "../../../../backend/db/schema";
import { ObjectId } from "mongodb";
import { cleanEquippedItems, emptyEquippedItems } from "@/lib/petItems";

function toPublicPath(value: unknown, fallback: string) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith("/") ? value : `/${value}`;
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session.userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const { users, pets } = await initSchemas();

    // find current user
    const currentUser = await users.findOne({
      clerkUserId: session.userId,
    });

    if (!currentUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const friendIds = currentUser.friends || [];

    const objectIds = friendIds.map((id: any) =>
        typeof id === "string" ? new ObjectId(id) : id
      );

    const friends = await users
      .find({
        _id: { $in: objectIds },
      })
      .toArray();

    const friendPets = await pets
      .find({
        ownerId: { $in: objectIds },
      })
      .toArray();

    const friendsWithPets = friends.map((friend: any) => {
      const pet = friendPets.find((p: any) => String(p.ownerId) === String(friend._id));

      return {
        ...friend,
        pet: pet
          ? {
              imageID: toPublicPath(pet.imageID, "/gator....png"),
              equippedItems: cleanEquippedItems(pet.equippedItems),
            }
          : {
              imageID: "/gator....png",
              equippedItems: emptyEquippedItems(),
            },
      };
    });

    return Response.json({ friends: friendsWithPets });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
