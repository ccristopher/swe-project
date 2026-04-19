"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FinishedBookCard } from "@/components/home/finished-book-card"; // adjust path if needed

export default function ProfilePage() {
  const { user } = useUser();

  const [data, setData] = useState<any>(null);
  const [quote, setQuote] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);

  // username editing
  const [editingName, setEditingName] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/users/profile?userId=${user.id}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setQuote(res.pet?.quote || "");
        setUsername(res.user?.username || "");
      });
  }, [user]);

  async function updateQuote() {
    const newQuote = prompt("Write a quote from your book:");
    if (!newQuote) return;

    const res = await fetch("/api/users/quote", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote: newQuote }),
    });

    if (!res.ok) {
      alert("Could not save quote");
      return;
    }

    const saved = await res.json();
    setQuote(typeof saved.quote === "string" ? saved.quote : newQuote);
  }

  async function saveUsername() {
    const res = await fetch("/api/users/username", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      alert("Could not update username");
      return;
    }

    setEditingName(false);
  }

  if (!data) {
    return (
      <div className="px-6 py-10 text-center text-on-surface-variant">
        Loading profile...
      </div>
    );
  }

  const booksPreview = data.books?.slice(0, 6);

  return (
    <section className="px-6 pb-16 pt-4 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* HERO / PET */}
        <Card className="overflow-hidden rounded-[2.5rem] border-0 bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                Profile
              </p>

              {editingName ? (
                <div className="mt-1 flex items-center gap-2">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-transparent border-b border-border outline-none font-display text-3xl font-extrabold"
                  />
                  <button
                    onClick={saveUsername}
                    className="text-sm font-bold text-primary"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h1
                  onClick={() => setEditingName(true)}
                  className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground cursor-pointer hover:opacity-80"
                >
                  {username}
                </h1>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-center">

            {/* PET (pixel-perfect) */}
            <Card className="relative min-h-72 rounded-[2rem] border-0 bg-secondary-container flex items-center justify-center">
              <div className="absolute bottom-6 w-24 h-4 bg-black/20 blur-md rounded-full" />
              <Image
                src={data.pet?.imageID || "/gator....png"}
                alt="Pet"
                width={192}
                height={192}
                className="image-pixel transition-transform duration-200 hover:scale-105"
              />
            </Card>

            {/* QUOTE + CTA */}
            <div className="space-y-4">
              <Card
                onClick={updateQuote}
                className="cursor-pointer rounded-[1.75rem] border-0 bg-surface-container-highest p-5 transition hover:shadow-md"
              >
                <p className="text-sm text-on-surface-variant">
                  {quote || "💬 Share a quote from your reading"}
                </p>
              </Card>

              <Link href="/books">
                <Button className="h-12 w-full rounded-full font-display text-base font-bold">
                  View All Books
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* BOOKS SECTION */}
        <section>
          <Card className="rounded-[2.25rem] border-0 bg-surface-container-low p-5 shadow-[0_14px_30px_var(--card-shadow)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                Books Read
              </h2>

              <Link
                href="/books"
                className="text-sm font-semibold text-primary hover:opacity-80"
              >
                View all
              </Link>
            </div>

            {booksPreview?.length ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {booksPreview.map((book: any) => (
                  <div
                    key={book._id}
                    onClick={() => setSelectedBook(book)}
                    className="cursor-pointer transition-transform hover:-translate-y-1"
                  >
                    {/* Book Cover */}
                    <div className="aspect-[2/3] w-full overflow-hidden rounded-[1.25rem] bg-surface-container shadow-sm">
                      <img
                        src={book.coverUrl || "/defbookcover-min.jpg"}
                        alt={book.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Optional title (makes grid feel less empty) */}
                    <p className="mt-1 truncate text-center text-[10px] text-on-surface-variant">
                      {book.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">
                No books yet. Start reading to build your collection.
              </p>
            )}
          </Card>
        </section>
      </div>

      {/* MODAL */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="relative w-[90%] max-w-md rounded-[2rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute right-4 top-4"
            >
              ✖
            </button>

            <Image
              src={selectedBook.coverUrl || "/defbookcover-min.jpg"}
              alt="Book cover"
              width={300}
              height={200}
              className="h-48 w-full rounded-xl object-cover"
            />

            <h2 className="mt-4 font-display text-xl font-extrabold">
              {selectedBook.name}
            </h2>

            <p className="text-sm text-on-surface-variant">
              {selectedBook.author}
            </p>

            <div className="mt-4">
              <p className="text-xs mb-1">
                {selectedBook.pagesRead || 0} / {selectedBook.numberOfPages} pages
              </p>

              <div className="h-3 overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${
                      selectedBook.numberOfPages
                        ? ((selectedBook.pagesRead || 0) /
                            selectedBook.numberOfPages) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <p className="mt-2 text-xs">
              {selectedBook.completed ? "✅ Completed" : "📖 In Progress"}
            </p>

            <div className="mt-4">
              <p className="text-sm font-bold">Your thoughts</p>
              <p className="text-sm italic">
                {selectedBook.review || "No review yet..."}
              </p>
            </div>

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

                setData((prev: any) => ({
                  ...prev,
                  books: prev.books.map((b: any) =>
                    b._id === selectedBook._id ? { ...b, review } : b
                  ),
                }));
              }}
              className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white"
            >
              Edit Review
            </button>
          </div>
        </div>
      )}

      {/* pixel rendering fix */}
      <style jsx global>{`
        .image-pixel {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
    </section>
  );
}
