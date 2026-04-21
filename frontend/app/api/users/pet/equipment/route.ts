import { auth } from "@clerk/nextjs/server";
import initSchemas from "@/lib/db/schema";
import {
  cleanEquippedItems,
  emptyEquippedItems,
  validateEquippedItems,
} from "@/lib/petItems";

function toPublicPath(value: unknown, fallback: string) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith("/") ? value : `/${value}`;
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session.userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();
    const { users, pets } = await initSchemas();

    const dbUser = await users.findOne({ clerkUserId: session.userId });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const unlockedRewards = Array.isArray(dbUser.unlockedRewards)
      ? dbUser.unlockedRewards.filter((reward: unknown) => typeof reward === "string")
      : [];

    const checked = validateEquippedItems(body?.equippedItems, unlockedRewards);

    if (!checked.ok) {
      return Response.json(
        { error: checked.error },
        { status: checked.error === "Item is locked" ? 403 : 400 }
      );
    }

    await pets.updateOne(
      { ownerId: dbUser._id },
      {
        $set: {
          equippedItems: checked.equippedItems,
        },
        $setOnInsert: {
          name: "Companion",
          type: "Gator",
          ownerId: dbUser._id,
          imageID: "/gator....png",
          quote: "",
        },
      },
      { upsert: true }
    );

    const pet = await pets.findOne({ ownerId: dbUser._id });

    return Response.json({
      pet: {
        ...pet,
        imageID: toPublicPath(pet?.imageID, "/gator....png"),
        equippedItems: cleanEquippedItems(pet?.equippedItems || emptyEquippedItems()),
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Could not update pet equipment" },
      { status: 500 }
    );
  }
}
