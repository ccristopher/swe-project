import { describe, expect, it } from "vitest";
import {
  rewardIdsForPagesGained,
  rewardIdsForPages,
  rewardLabelForLevel,
  buildUserProgressUpdate,
  labelForRewardId,
} from "./levelRewards";

describe("rewardIdsForPagesGained", () => {
  it("grants nothing below level 2", () => {
    expect(rewardIdsForPagesGained(0, 100)).toEqual([]);
  });

  it("grants lvl-2 when crossing 150 pages", () => {
    expect(rewardIdsForPagesGained(100, 160)).toEqual(["lvl-2"]);
  });

  it("grants multiple when skipping levels", () => {
    expect(rewardIdsForPagesGained(0, 400)).toEqual(["lvl-2", "lvl-3"]);
  });
});

describe("rewardIdsForPages", () => {
  it("returns all rewards currently eligible at the user's total pages", () => {
    expect(rewardIdsForPages(400)).toEqual(["lvl-2", "lvl-3"]);
  });
});

describe("rewardLabelForLevel", () => {
  it("has a label for level 2", () => {
    expect(rewardLabelForLevel(2).length).toBeGreaterThan(0);
  });
});

describe("labelForRewardId", () => {
  it("maps lvl-2 to the same label as level 2", () => {
    expect(labelForRewardId("lvl-2")).toBe(rewardLabelForLevel(2));
    expect(labelForRewardId("not-a-reward")).toBe("not-a-reward");
  });
});

describe("buildUserProgressUpdate", () => {
  it("includes addToSet when new rewards", () => {
    const u = buildUserProgressUpdate(0, [
      { completed: true, numberOfPages: 200, pagesRead: 0 },
    ]);
    expect(u.$set.unlockedRewards).toEqual(["lvl-2"]);
    expect(u.$addToSet?.unlockedRewards.$each).toContain("lvl-2");
  });

  it("replaces unlocked rewards when progress falls", () => {
    const u = buildUserProgressUpdate(400, [
      { completed: false, numberOfPages: 200, pagesRead: 100 },
    ]);

    expect(u.$set.unlockedRewards).toEqual([]);
    expect(u.$addToSet).toBeUndefined();
  });
});
