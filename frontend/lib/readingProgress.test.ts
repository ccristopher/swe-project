import { describe, expect, it } from "vitest";
import {
  canMarkBookCompleted,
  countCompletedBooks,
  getBookStatus,
  getLevelFromTotalPages,
  shouldAutoCompleteBook,
  sumPagesFromBooks,
} from "./readingProgress";

describe("sumPagesFromBooks", () => {
  it("uses pagesRead when not completed", () => {
    expect(sumPagesFromBooks([{ pagesRead: 10, numberOfPages: 100 }])).toBe(10);
  });

  it("uses full page count when completed", () => {
    expect(
      sumPagesFromBooks([{ completed: true, numberOfPages: 200, pagesRead: 0 }])
    ).toBe(200);
  });
});

describe("getLevelFromTotalPages", () => {
  it("starts at level 1", () => {
    expect(getLevelFromTotalPages(0).level).toBe(1);
  });

  it("levels up every 150 pages", () => {
    expect(getLevelFromTotalPages(149).level).toBe(1);
    expect(getLevelFromTotalPages(150).level).toBe(2);
    expect(getLevelFromTotalPages(300).level).toBe(3);
  });
});

describe("countCompletedBooks", () => {
  it("counts completed", () => {
    expect(
      countCompletedBooks([{ completed: true }, { completed: false }])
    ).toBe(1);
  });
});

describe("completion helpers", () => {
  it("allows manual completion at 90 percent progress", () => {
    expect(canMarkBookCompleted({ pagesRead: 90, numberOfPages: 100 })).toBe(true);
    expect(canMarkBookCompleted({ pagesRead: 89, numberOfPages: 100 })).toBe(false);
  });

  it("auto-completes only when progress reaches total pages", () => {
    expect(shouldAutoCompleteBook({ pagesRead: 100, numberOfPages: 100 })).toBe(true);
    expect(shouldAutoCompleteBook({ pagesRead: 90, numberOfPages: 100 })).toBe(false);
  });

  it("prefers DNF status over completed", () => {
    expect(getBookStatus({ completed: true, dnf: true })).toBe("dnf");
  });
});
