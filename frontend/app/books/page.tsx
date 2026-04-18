"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { BookDetailsModal } from "@/components/books/book-details-modal";
import type { FinishedBook } from "@/components/home/home-content.data";

export default function BooksPage() {
  const { user } = useUser();
  const [books, setBooks] = useState<FinishedBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<FinishedBook | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/books`)
      .then(res => res.json())
      .then(data => {
        const mappedBooks: FinishedBook[] = (data.books || []).map((book: any) => ({
          _id: book._id,
          author: book.author,
          completed: Boolean(book.completed),
          coverUrl: book.coverUrl || "/defbookcover-min.jpg",
          imageSrc: book.coverUrl || "/defbookcover-min.jpg",
          name: book.name,
          numberOfPages: book.numberOfPages || 0,
          pagesRead: book.pagesRead || 0,
          review: book.review || "",
          title: book.name,
        }));

        setBooks(mappedBooks);
      });
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
              src={book.coverUrl || "/defbookcover-min.jpg"}
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
      <BookDetailsModal
        book={selectedBook}
        onCloseAction={() => setSelectedBook(null)}
        onBookUpdatedAction={(updatedBook) => {
          setSelectedBook(updatedBook);
          setBooks((prev) => prev.map((book) => (book._id === updatedBook._id ? updatedBook : book)));
        }}
      />
    </div>
  );
}