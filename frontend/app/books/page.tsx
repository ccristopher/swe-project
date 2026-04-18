"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function BooksPage() {
  const { user } = useUser();
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/books`)
      .then(res => res.json())
      .then(data => setBooks(data.books));
  }, [user]);

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-3xl space-y-4">

      <div className="flex items-center justify-between">
        <Link href="/profile" className="primaryAction px-4 py-2 rounded-full text-sm">
            ← Back
        </Link>

        <h1 className="text-2xl font-bold statValue">
            Your Library 📚
        </h1>
        </div>

        {books.map((book) => (
          <div
            key={book._id}
            onClick={() => setSelectedBook(book)}
            className="secondaryAction p-4 rounded-xl flex gap-4 cursor-pointer hover:-translate-y-1 transition"
          >
            {/* COVER */}
            <img
              src={book.coverUrl || "/default-book-cover.png"}
              className="w-20 h-28 object-cover rounded-md"
            />

            {/* INFO */}
            <div className="flex-1">
              <h2 className="font-bold">{book.name}</h2>
              <p className="text-sm progressLabel">{book.author}</p>

              <p className="text-xs mt-2">
                📄 {book.numberOfPages} pages
              </p>

              <p className="text-xs">
                ✅ {book.completed ? "Completed" : "In Progress"}
              </p>

              {/* FUTURE REVIEW */}
              {book.review && (
                <p className="mt-2 text-sm italic">
                  “{book.review}”
                </p>
              )}
            </div>
          </div>
        ))}

      </div>
      {selectedBook && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => setSelectedBook(null)}
  >
    <div
      className="bg-white dark:bg-[#131920] rounded-2xl p-6 w-[90%] max-w-md relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* CLOSE */}
      <button
        onClick={() => setSelectedBook(null)}
        className="absolute top-3 right-3"
      >
        ✖
      </button>

      {/* COVER */}
      <img
        src={selectedBook.coverUrl || "/default-book-cover.png"}
        className="w-full h-48 object-cover rounded-xl"
      />

      {/* INFO */}
      <h2 className="mt-4 text-lg font-bold statValue">
        {selectedBook.name}
      </h2>

      <p className="text-sm progressLabel">
        {selectedBook.author}
      </p>

      {/* PROGRESS BAR 🔥 */}
      <div className="mt-4">
        <p className="text-xs mb-1">
          {selectedBook.pagesRead || 0} / {selectedBook.numberOfPages} pages
        </p>

        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{
              width: `${
                selectedBook.numberOfPages
                  ? ((selectedBook.pagesRead || 0) / selectedBook.numberOfPages) * 100
                  : 0
              }%`
            }}
          />
        </div>
      </div>

      {/* STATUS */}
      <p className="text-xs mt-2">
        {selectedBook.completed ? "✅ Completed" : "📖 In Progress"}
      </p>

      {/* REVIEW */}
      <div className="mt-4">
        <p className="text-sm font-bold">Your thoughts</p>
        <p className="text-sm italic">
          {selectedBook.review || "No review yet..."}
        </p>
      </div>

      {/* EDIT REVIEW */}
      <button
        onClick={async () => {
          const review = prompt("Update your thoughts:");
          if (!review) return;

          await fetch(`/api/books/${selectedBook._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ review }),
          });

          setSelectedBook({ ...selectedBook, review });

          setBooks((prev) =>
            prev.map((b) =>
              b._id === selectedBook._id ? { ...b, review } : b
            )
          );
        }}
        className="mt-4 primaryAction px-4 py-2 rounded-full text-sm"
      >
        Edit Review
      </button>

      {/* UPDATE PROGRESS */}
      <button
        onClick={async () => {
          const pages = prompt("Update pages read:");
          if (!pages) return;

          const pagesNum = Number(pages);

          await fetch(`/api/books/${selectedBook._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pagesRead: pagesNum }),
          });

          setSelectedBook({ ...selectedBook, pagesRead: pagesNum });

          setBooks((prev) =>
            prev.map((b) =>
              b._id === selectedBook._id ? { ...b, pagesRead: pagesNum } : b
            )
          );
        }}
        className="mt-2 text-xs underline"
      >
        Update Progress
      </button>

    </div>
    </div>
    )}
    </div>
  );
}