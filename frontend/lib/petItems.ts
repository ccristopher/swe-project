export type PetItemSlot = "head" | "neck" | "treat";

export type EquippedItems = {
  head: string | null;
  neck: string | null;
  treat: string | null;
};

export type PetItem = {
  id: string;
  name: string;
  slot: PetItemSlot;
  image: string;
  unlockReward: string;
  unlockLevel: number;
};

export const petItems: PetItem[] = [
  {
    id: "hat",
    name: "Hat",
    slot: "head",
    image: "/hat.png",
    unlockReward: "lvl-2",
    unlockLevel: 2,
  },
  {
    id: "scarf",
    name: "Scarf",
    slot: "neck",
    image: "/scarf.png",
    unlockReward: "lvl-3",
    unlockLevel: 3,
  },
  {
    id: "sandwich",
    name: "Sandwich",
    slot: "treat",
    image: "/sandwhich.png",
    unlockReward: "lvl-4",
    unlockLevel: 4,
  },
];

export const petItemSlots: PetItemSlot[] = ["head", "neck", "treat"];

export function emptyEquippedItems(): EquippedItems {
  return {
    head: null,
    neck: null,
    treat: null,
  };
}

export function getPetItem(itemId: string | null | undefined) {
  if (!itemId) return undefined;
  return petItems.find((item) => item.id === itemId);
}

export function isPetItemUnlocked(itemId: string, unlockedRewards: string[]) {
  const item = getPetItem(itemId);
  return Boolean(item && unlockedRewards.includes(item.unlockReward));
}

export function cleanEquippedItems(value: unknown): EquippedItems {
  const equipped = emptyEquippedItems();

  if (!value || typeof value !== "object") return equipped;

  const rawItems = value as Partial<Record<PetItemSlot, unknown>>;

  for (const slot of petItemSlots) {
    const itemId = rawItems[slot];
    const item = typeof itemId === "string" ? getPetItem(itemId) : undefined;

    if (item && item.slot === slot) {
      equipped[slot] = item.id;
    }
  }

  return equipped;
}

export function validateEquippedItems(value: unknown, unlockedRewards: string[]) {
  const equipped = emptyEquippedItems();

  if (!value || typeof value !== "object") {
    return { ok: true, equippedItems: equipped };
  }

  const rawItems = value as Partial<Record<PetItemSlot, unknown>>;

  for (const slot of petItemSlots) {
    const itemId = rawItems[slot] ?? null;

    if (itemId === null) continue;

    if (typeof itemId !== "string") {
      return { ok: false, error: "Invalid item" };
    }

    const item = getPetItem(itemId);

    if (!item) {
      return { ok: false, error: "Unknown item" };
    }

    if (item.slot !== slot) {
      return { ok: false, error: "Item is in the wrong slot" };
    }

    if (!unlockedRewards.includes(item.unlockReward)) {
      return { ok: false, error: "Item is locked" };
    }

    equipped[slot] = item.id;
  }

  return { ok: true, equippedItems: equipped };
}

export function pruneEquippedItemsToUnlockedRewards(value: unknown, unlockedRewards: string[]) {
  const equipped = cleanEquippedItems(value);

  for (const slot of petItemSlots) {
    const itemId = equipped[slot];
    const item = getPetItem(itemId);

    if (!item || !unlockedRewards.includes(item.unlockReward)) {
      equipped[slot] = null;
    }
  }

  return equipped;
}
