import { auth } from "@clerk/nextjs/server";
import initSchemas from "../../../../../backend/db/schema";

const PET_OPTIONS = {
  gator: {
    imageID: "/gator....png",
    type: "gator",
  },
  thor: {
    imageID: "/thor....png",
    type: "thor",
  },
} as const;

type PetChoice = keyof typeof PET_OPTIONS;

function sanitizePetName(input: unknown) {
  if (typeof input !== "string") return null;

  const petName = input.trim();

  if (!petName) return null;
  if (petName.length > 30) return null;

  return petName;
}

function parseMonthlyGoalTargetPages(input: unknown) {
  const monthlyGoalTargetPages = Math.floor(Number(input));

  if (!Number.isFinite(monthlyGoalTargetPages)) return null;
  if (monthlyGoalTargetPages < 1 || monthlyGoalTargetPages > 100000) return null;

  return monthlyGoalTargetPages;
}

function isPetChoice(input: unknown): input is PetChoice {
  return typeof input === "string" && input in PET_OPTIONS;
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session.userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const petName = sanitizePetName(body?.petName);
    const monthlyGoalTargetPages = parseMonthlyGoalTargetPages(body?.monthlyGoalTargetPages);
    const petChoice = body?.petChoice;

    if (!petName) {
      return Response.json({ error: "Please choose a pet name" }, { status: 400 });
    }

    if (!isPetChoice(petChoice)) {
      return Response.json({ error: "Please select one of the available pets" }, { status: 400 });
    }

    if (!monthlyGoalTargetPages) {
      return Response.json({ error: "Please enter a valid monthly page goal" }, { status: 400 });
    }

    const { pets, users } = await initSchemas();
    const dbUser = await users.findOne({ clerkUserId: session.userId });

    if (!dbUser) {
      return Response.json({ error: "User profile not found" }, { status: 404 });
    }

    const selectedPet = PET_OPTIONS[petChoice];

    await pets.updateOne(
      { ownerId: dbUser._id },
      {
        $set: {
          imageID: selectedPet.imageID,
          name: petName,
          type: selectedPet.type,
        },
      },
      { upsert: true },
    );

    await users.updateOne(
      { _id: dbUser._id },
      {
        $set: {
          monthlyGoalTargetPages,
          onboardingCompleted: true,
        },
      },
    );

    return Response.json({
      ok: true,
      monthlyGoalTargetPages,
      pet: {
        imageID: selectedPet.imageID,
        name: petName,
        type: selectedPet.type,
      },
    });
  } catch (err: any) {
    console.error("Error saving onboarding data:", err);

    return Response.json(
      { error: err.message || "Failed to save onboarding data" },
      { status: 500 },
    );
  }
}
