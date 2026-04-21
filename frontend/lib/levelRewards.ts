/** Hello this is Avi Patel aka firedog 1234)=
* I had cursor fill in the rewards so i could see 
* if the rewards were actuallt wokring they used to be like random rewards like
* 6: "Scholar bookmark", or whatever.
* in short I wrote the initial reading progress logic and tests, 
* Cursor refactored it into the utility functions after i asked for a code
* review it caught a lot of bugs and issues and started refactoring stuff and after testing it worked, 
* and I then integrated both into the existing frontend and backend.
* This doesnt necessarily apply to this file but the ones in the pr that includes the level system which 
* includes this file
* cursor also helped with the page changes.
* 
* i do know it refactored readingprogress file heavily and then it worked
*/

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

export function rewardIdsForPages(totalPages: number): string[] {
  return rewardIdsForPagesGained(0, totalPages);
}

export function buildUserProgressUpdate(oldTotalPages: number, booksAfter: BookForPages[]) {
  const { totalPagesRead, booksCompleted } = totalsFromBooks(booksAfter);
  const newRewards = rewardIdsForPagesGained(oldTotalPages, totalPagesRead);
  const unlockedRewards = rewardIdsForPages(totalPagesRead);

  const update: {
    $set: Record<string, number | string[]>;
    $addToSet?: { unlockedRewards: { $each: string[] } };
  } = {
    $set: { totalPagesRead, booksCompleted, unlockedRewards },
  };

  if (newRewards.length > 0) {
    update.$addToSet = { unlockedRewards: { $each: newRewards } };
  }

  return update;
}
