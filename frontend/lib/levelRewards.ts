import {
  READING_PAGES_PER_LEVEL,
  getLevelFromTotalPages,
  totalsFromBooks,
  type BookForPages,
} from "./readingProgress";

export function rewardIdForLevel(level: number): string {
  return `lvl-${level}`;
}

/** Human-readable name for the reward earned when you *reach* this level (level ≥ 2). */
export function rewardLabelForLevel(level: number): string {
  const names: Record<number, string> = {
    2: "Hat",
    3: "Scarf",
    4: "Sandwich",
    5: "Item 4",
    6: "Item 5",
    7: "Item 6",
    8: "Item 7",
    9: "Item 8",
    10: "Item 9",
  };
  if (names[level]) return names[level];
  if (level < 2) return "";
  return `Level ${level} keepsake`;
}

export function labelForRewardId(id: string): string {
  const m = /^lvl-(\d+)$/.exec(id);
  if (!m) return id;
  return rewardLabelForLevel(Number(m[1]));
}

/** Reward ids granted when total pages cross from oldTotal → newTotal (same level rules as pet level). */
export function rewardIdsForPagesGained(oldTotal: number, newTotal: number): string[] {
  const oldLevel = getLevelFromTotalPages(oldTotal, READING_PAGES_PER_LEVEL).level;
  const newLevel = getLevelFromTotalPages(newTotal, READING_PAGES_PER_LEVEL).level;
  const out: string[] = [];
  for (let L = oldLevel + 1; L <= newLevel; L++) {
    if (L >= 2) out.push(rewardIdForLevel(L));
  }
  return out;
}

export function buildUserProgressUpdate(oldTotalPages: number, booksAfter: BookForPages[]) {
  const { totalPagesRead, booksCompleted } = totalsFromBooks(booksAfter);
  const newRewards = rewardIdsForPagesGained(oldTotalPages, totalPagesRead);

  const update: {
    $set: Record<string, number>;
    $addToSet?: { unlockedRewards: { $each: string[] } };
  } = {
    $set: { totalPagesRead, booksCompleted },
  };

  if (newRewards.length > 0) {
    update.$addToSet = { unlockedRewards: { $each: newRewards } };
  }

  return update;
}
