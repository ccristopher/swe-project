"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { BookDetailsModal } from "@/components/books/book-details-modal";
import type { FinishedBook } from "@/components/home/home-content.data";
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
    <section className="px-6 pb-16 pt-6 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* HEADER */}
          <div className="rounded-[2.5rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]">
            <div className="flex items-start justify-between gap-4">
              
              {/* LEFT */}
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                  Library
                </p>

                <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
                  Your Books 📚
                </h1>

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
              </div>

              {/* RIGHT (ADD BUTTON) */}
              <Link href="/books/log">
                <div className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:scale-105">
                  Add Book
                </div>
              </Link>

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