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
    2: "Bronze bookmark",
    3: "Silver ribbon",
    4: "Gold star sticker",
    5: "Reading cap patch",
    6: "Scholar bookmark",
    7: "Library badge",
    8: "Storyteller charm",
    9: "Bookworm pin",
    10: "Legend reader frame",
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
