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
    const petsFindOne = vi.fn().mockResolvedValue({
      ownerId: "db-user-id",
      equippedItems: { head: "hat", neck: null, treat: null },
    });
    const petsUpdateOne = vi.fn().mockResolvedValue({});

    const booksUpdateOne = vi.fn().mockResolvedValue({ matchedCount: 1 });
    const booksFindOne = vi.fn().mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      ownerId: "db-user-id",
      numberOfPages: 60,
      pagesRead: 20,
      completed: false,
      dnf: false,
    });
    const booksFind = vi.fn();
    booksFind.mockReturnValueOnce({
      toArray: vi.fn().mockResolvedValue([
        {
          _id: "507f1f77bcf86cd799439011",
          ownerId: "db-user-id",
          numberOfPages: 60,
          pagesRead: 20,
          completed: false,
          dnf: false,
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
          dnf: false,
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
        findOne: booksFindOne,
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
    expect(savedFields.completed).toBe(true);
    expect(savedFields.dnf).toBe(false);
    expect(petsUpdateOne).toHaveBeenCalledTimes(1);
  });

  it("rejects manual completion before 90 percent progress", async () => {
    authMock.mockResolvedValue({ userId: "user_123" });

    const usersFindOne = vi.fn().mockResolvedValue({ _id: "db-user-id" });
    const booksFindOne = vi.fn().mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      ownerId: "db-user-id",
      numberOfPages: 100,
      pagesRead: 40,
      completed: false,
      dnf: false,
    });

    initSchemasMock.mockResolvedValue({
      users: {
        findOne: usersFindOne,
        updateOne: vi.fn(),
      },
      pets: {
        findOne: vi.fn().mockResolvedValue(null),
        updateOne: vi.fn(),
      },
      books: {
        find: vi.fn(),
        findOne: booksFindOne,
        updateOne: vi.fn(),
      },
    });

    const { PATCH } = await import("./route");

    const req = new Request("http://localhost/api/books/507f1f77bcf86cd799439011", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });

    const res = await PATCH(
      req,
      { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) }
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(String(data.error)).toContain("90%");
  });

  it("marks a book as DNF regardless of progress", async () => {
    authMock.mockResolvedValue({ userId: "user_123" });

    const usersFindOne = vi.fn().mockResolvedValue({ _id: "db-user-id" });
    const usersUpdateOne = vi.fn().mockResolvedValue({});
    const petsFindOne = vi.fn().mockResolvedValue({
      ownerId: "db-user-id",
      equippedItems: { head: "hat", neck: "scarf", treat: null },
    });
    const petsUpdateOne = vi.fn().mockResolvedValue({});
    const booksUpdateOne = vi.fn().mockResolvedValue({ matchedCount: 1 });
    const booksFindOne = vi.fn().mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      ownerId: "db-user-id",
      numberOfPages: 300,
      pagesRead: 12,
      completed: false,
      dnf: false,
    });
    const booksFind = vi.fn();
    booksFind.mockReturnValueOnce({
      toArray: vi.fn().mockResolvedValue([
        {
          _id: "507f1f77bcf86cd799439011",
          ownerId: "db-user-id",
          numberOfPages: 300,
          pagesRead: 12,
          completed: false,
          dnf: false,
        },
      ]),
    });
    booksFind.mockReturnValueOnce({
      toArray: vi.fn().mockResolvedValue([
        {
          _id: "507f1f77bcf86cd799439011",
          ownerId: "db-user-id",
          numberOfPages: 300,
          pagesRead: 12,
          completed: false,
          dnf: true,
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
        findOne: booksFindOne,
        updateOne: booksUpdateOne,
      },
    });

    const { PATCH } = await import("./route");

    const req = new Request("http://localhost/api/books/507f1f77bcf86cd799439011", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dnf: true }),
    });

    const res = await PATCH(
      req,
      { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) }
    );

    expect(res.status).toBe(200);
    const savedFields = booksUpdateOne.mock.calls[0][1].$set;
    expect(savedFields.completed).toBe(false);
    expect(savedFields.dnf).toBe(true);
    expect(petsUpdateOne.mock.calls[0][1].$set.equippedItems).toEqual({
      head: null,
      neck: null,
      treat: null,
    });
  });
});

describe("DELETE /api/books/[id]", () => {
  beforeEach(() => {
    authMock.mockReset();
    initSchemasMock.mockReset();
  });

  it("deletes the book without changing saved user progress or pet equipment", async () => {
    authMock.mockResolvedValue({ userId: "user_123" });

    const usersFindOne = vi.fn().mockResolvedValue({
      _id: "db-user-id",
      totalPagesRead: 400,
      booksCompleted: 2,
      unlockedRewards: ["lvl-2", "lvl-3"],
    });
    const booksDeleteOne = vi.fn().mockResolvedValue({ deletedCount: 1 });
    const usersUpdateOne = vi.fn().mockResolvedValue({});
    const petsUpdateOne = vi.fn().mockResolvedValue({});

    initSchemasMock.mockResolvedValue({
      users: {
        findOne: usersFindOne,
        updateOne: usersUpdateOne,
      },
      books: {
        deleteOne: booksDeleteOne,
      },
      pets: {
        findOne: vi.fn(),
        updateOne: petsUpdateOne,
      },
    });

    const { DELETE } = await import("./route");

    const res = await DELETE(
      new Request("http://localhost/api/books/507f1f77bcf86cd799439011", { method: "DELETE" }),
      { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) }
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Book deleted");
    expect(usersUpdateOne).not.toHaveBeenCalled();
    expect(petsUpdateOne).not.toHaveBeenCalled();
  });
});
