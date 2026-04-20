"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { BookStatusIndicator } from "@/components/books/book-status-indicator";
import { BookDetailsModal } from "@/components/books/book-details-modal";
import type { FinishedBook } from "@/components/home/home-content.data";
import { getBookStatus } from "@/lib/readingProgress";

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
          dnf: Boolean(book.dnf),
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
        <div className="rounded-[2.5rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                Library
              </p>

              <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
                Your Books
              </h1>
            </div>

            <Link href="/books/log">
              <div className="primaryAction shrink-0 cursor-pointer rounded-full px-5 py-2 font-display text-sm font-bold text-accent-foreground">
                Add Book
              </div>
            </Link>
          </div>
        </div>

        {books.map((book) => {
          const status = getBookStatus(book);

          return (
            <div
              key={book._id}
              onClick={() => setSelectedBook(book)}
              className="secondaryAction flex cursor-pointer gap-4 rounded-[1.75rem] p-4 transition-shadow hover:shadow-[0_14px_30px_var(--card-shadow)]"
            >
              <Image
                src={book.coverUrl || "/defbookcover-min.jpg"}
                alt={`${book.name} cover`}
                width={80}
                height={112}
                className="h-28 w-20 rounded-[1rem] object-cover"
              />

              <div className="flex-1">
                <h2 className="font-bold">{book.name}</h2>
                <p className="text-sm progressLabel">{book.author}</p>

                <p className="mt-2 text-xs">{book.numberOfPages} pages</p>
                <BookStatusIndicator className="mt-2" status={status} />

                {book.review ? (
                  <p className="mt-2 text-sm italic">&quot;{book.review}&quot;</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <BookDetailsModal
        book={selectedBook}
        onCloseAction={() => setSelectedBook(null)}
        onBookDeletedAction={(deletedBookId) => {
          setSelectedBook(null);
          setBooks((prev) => prev.filter((book) => book._id !== deletedBookId));
        }}
        onBookUpdatedAction={(updatedBook) => {
          setSelectedBook(updatedBook);
          setBooks((prev) => prev.map((book) => (book._id === updatedBook._id ? updatedBook : book)));
        }}
      />
    </section>
  );
}
