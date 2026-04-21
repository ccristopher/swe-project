/** Hello this is Avi Patel aka firedog 1234)=
* This was the first test file i made i think
* Had cursor build skeleoton and explain whow the code in the
* below file works.
* Then wrote the logic to tests the quote sizes
* also asked cursor the cases i need to consider note i asked AI this for basically all tests i made
*
* https://dev.to/wallacefreitas/best-techniques-to-create-tests-with-the-vitest-framework-9al
*/


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
