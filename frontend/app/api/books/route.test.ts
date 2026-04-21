import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.fn();
const initSchemasMock = vi.fn();
const fetchMock = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
}));

vi.mock("@/lib/db/schema", () => ({
  default: initSchemasMock,
}));

vi.stubGlobal("fetch", fetchMock);

describe("POST /api/books validation", () => {
  beforeEach(() => {
    authMock.mockReset();
    initSchemasMock.mockReset();
    fetchMock.mockReset();
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

  it("creates new books as incomplete by default", async () => {
    authMock.mockResolvedValue({ userId: "user_123" });
    fetchMock.mockResolvedValue({ ok: false });

    const usersFindOne = vi.fn().mockResolvedValue({ _id: "db-user-id" });
    const usersUpdateOne = vi.fn().mockResolvedValue({});
    const petsFindOne = vi.fn().mockResolvedValue(null);
    const petsUpdateOne = vi.fn().mockResolvedValue({});
    const booksInsertOne = vi.fn().mockResolvedValue({ insertedId: "book-id" });
    const booksFind = vi.fn();
    booksFind.mockReturnValueOnce({
      toArray: vi.fn().mockResolvedValue([]),
    });
    booksFind.mockReturnValueOnce({
      toArray: vi.fn().mockResolvedValue([
        {
          _id: "book-id",
          ownerId: "db-user-id",
          numberOfPages: 320,
          pagesRead: 0,
          completed: false,
        },
      ]),
    });

    initSchemasMock.mockResolvedValue({
      users: {
        findOne: usersFindOne,
        updateOne: usersUpdateOne,
      },
      pets: {
        findOne: petsFindOne,
        updateOne: petsUpdateOne,
      },
      books: {
        find: booksFind,
        insertOne: booksInsertOne,
      },
    });

    const { POST } = await import("./route");

    const req = new Request("http://localhost/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "A Book",
        author: "An Author",
        genre: "Fiction",
        pageCount: 320,
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(booksInsertOne).toHaveBeenCalledTimes(1);
    expect(booksInsertOne.mock.calls[0][0]).toMatchObject({
      completed: false,
      dnf: false,
      numberOfPages: 320,
      pagesRead: 0,
    });
    expect(data.error).toBeUndefined();
  });
});
