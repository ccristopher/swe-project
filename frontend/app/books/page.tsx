"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { BookDetailsModal } from "@/components/books/book-details-modal";
import type { FinishedBook } from "@/components/home/home-content.data";
import Link from "next/link";

export default function BooksPage() {
  const { user } = useUser();
  const [books, setBooks] = useState<FinishedBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<FinishedBook | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/books`)
      .then((res) => res.json())
      .then((data) => {
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

                <p className="mt-2 text-sm text-on-surface-variant">
                  All your finished and in-progress reads in one place.
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

        {/* BOOK LIST */}
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book._id}
              onClick={() => setSelectedBook(book)}
              className="flex cursor-pointer gap-4 rounded-[1.75rem] bg-surface-container p-4 transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={book.coverUrl || "/defbookcover-min.jpg"}
                className="h-28 w-20 rounded-[1.25rem] object-cover shadow-sm"
              />

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="font-bold text-on-surface">
                    {book.name}
                  </h2>

                  <p className="text-sm text-on-surface-variant">
                    {book.author}
                  </p>
                </div>

                <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
                  <p>📄 {book.numberOfPages} pages</p>
                  <p>
                    {book.completed ? "✅ Completed" : "📖 In Progress"}
                  </p>
                </div>

                {book.review && (
                  <p className="mt-2 line-clamp-2 text-sm italic text-on-surface">
                    “{book.review}”
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL */}
      <BookDetailsModal
        book={selectedBook}
        onCloseAction={() => setSelectedBook(null)}
        onBookUpdatedAction={(updatedBook) => {
          setSelectedBook(updatedBook);
          setBooks((prev) =>
            prev.map((book) =>
              book._id === updatedBook._id ? updatedBook : book
            )
          );
        }}
      />
    </section>
  );
}