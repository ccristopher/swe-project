import { describe, expect, it } from "vitest";
import { clampQuote } from "./quoteUtils";

describe("clampQuote", () => {
  it("trims whitespace", () => {
    expect(clampQuote("  hello  ")).toBe("hello");
  });

  it("cuts long strings", () => {
    const long = "a".repeat(500);
    expect(clampQuote(long, 100).length).toBe(100);
  });

  it("leaves short strings alone", () => {
    expect(clampQuote("Short line.")).toBe("Short line.");
  });
});
