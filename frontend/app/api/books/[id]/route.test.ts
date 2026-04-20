import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const initSchemasMock = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
}));

vi.mock("../../../../../backend/db/schema", () => ({
  default: initSchemasMock,
}));

describe("PATCH /api/books/[id]", () => {
  beforeEach(() => {
    authMock.mockReset();
    initSchemasMock.mockReset();
  });

  it("rounds pagesRead down before saving", async () => {
    authMock.mockResolvedValue({ userId: "user_123" });

    const usersFindOne = vi.fn();
    const usersUpdateOne = vi.fn();
    usersFindOne.mockResolvedValue({ _id: "db-user-id" });
    usersUpdateOne.mockResolvedValue({});

    const booksUpdateOne = vi.fn().mockResolvedValue({ matchedCount: 1 });
    const booksFind = vi.fn();
    booksFind.mockReturnValueOnce({
      toArray: vi.fn().mockResolvedValue([
        {
          _id: "507f1f77bcf86cd799439011",
          ownerId: "db-user-id",
          numberOfPages: 60,
          pagesRead: 20,
          completed: false,
        },
      ]),
    });
    booksFind.mockReturnValueOnce({
      toArray: vi.fn().mockResolvedValue([
        {
          _id: "507f1f77bcf86cd799439011",
          ownerId: "db-user-id",
          numberOfPages: 60,
          pagesRead: 60,
          completed: true,
        },
      ]),
    });

    initSchemasMock.mockResolvedValue({
      users: {
        findOne: usersFindOne,
        updateOne: usersUpdateOne,
      },
      books: {
        find: booksFind,
        updateOne: booksUpdateOne,
      },
    });

    const { PATCH } = await import("./route");

    const req = new Request("http://localhost/api/books/507f1f77bcf86cd799439011", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagesRead: 80.9 }),
    });

    const res = await PATCH(
      req,
      { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) }
    );

    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Book updated");
    expect(booksUpdateOne).toHaveBeenCalledTimes(1);
    const savedFields = booksUpdateOne.mock.calls[0][1].$set;
    expect(savedFields.pagesRead).toBe(80);
  });
});
