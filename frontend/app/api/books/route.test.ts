import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const initSchemasMock = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
}));

vi.mock("../../../../backend/db/schema", () => ({
  default: initSchemasMock,
}));

describe("POST /api/books validation", () => {
  beforeEach(() => {
    authMock.mockReset();
  });

  it("returns 400 when pageCount is not a number", async () => {
    authMock.mockResolvedValue({ userId: "user_123" });

    const { POST } = await import("./route");

    const badBody = {
      title: "A Book",
      author: "An Author",
      genre: "Fiction",
      pageCount: "not-a-number",
    };

    const req = new Request("http://localhost/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(badBody),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(String(data.error)).toContain("pageCount");
  });
});
