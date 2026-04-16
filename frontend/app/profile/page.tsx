"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useUser();

  const [data, setData] = useState<any>(null);
  const [quote, setQuote] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/users/profile?userId=${user.id}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setQuote(res.pet?.quote || "");
      });
  }, [user]);

  async function updateQuote() {
    const newQuote = prompt("Write a quote from your book:");
    if (!newQuote) return;

    await fetch("/api/users/quote", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id,
        quote: newQuote,
      }),
    });

    setQuote(newQuote);
  }

  if (!data) return <div className="p-6">Loading...</div>;

  const booksPreview = data.books?.slice(0, 6);

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-md md:max-w-2xl space-y-6">

        {/* PET SECTION */}
        <div className="petStage relative h-[50vh] rounded-2xl flex flex-col items-center justify-center text-center p-4">

          <div className="petStageGlow absolute inset-0" />

          {/* Leaderboard badge */}
          <div className="absolute top-3 right-3 starBadge px-3 py-1 rounded-full text-sm">
            #{data.user?.rank || "-"}
          </div>

          {/* Pet */}
          <img
            src={data.pet?.imageID}
            className="w-32 h-32 z-10"
          />

          {/* Username */}
          <h1 className="text-xl font-bold statValue mt-2 z-10">
            {data.user?.username}
          </h1>

          {/* Quote bubble */}
          <div
            onClick={updateQuote}
            className="mt-4 cursor-pointer secondaryAction px-4 py-3 rounded-xl max-w-xs z-10"
          >
            <p className="progressLabel">
              {quote || "💬 Share a quote!"}
            </p>
          </div>
        </div>

        {/* BOOKS SECTION */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="streakCopy text-lg font-bold">
              Books Read
            </h2>

            

            <Link href="/books">
              <Button className="primaryAction">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {booksPreview?.map((book: any) => (
                <div
                  key={book._id}
                  onClick={() => setSelectedBook(book)}
                  className="secondaryAction rounded-lg overflow-hidden p-2 cursor-pointer hover:-translate-y-1 transition"
                >
                <img
                  src={book.coverUrl || "/default-book-cover.png"}
                  className="w-full h-32 object-cover rounded-md"
                />

                <p className="text-xs mt-2 text-center truncate">
                  {book.name}
                </p>
              </div>
            ))}
          </div>
        </div>

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

      {/* TITLE */}
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

              // update UI instantly
              setSelectedBook({ ...selectedBook, review });

              setData((prev: any) => ({
                ...prev,
                books: prev.books.map((b: any) =>
                  b._id === selectedBook._id ? { ...b, review } : b
                ),
              }));
            }}
            className="mt-4 primaryAction px-4 py-2 rounded-full text-sm"
          >
            Edit Review
          </button>
        </div>
      </div>
    )}
    </div>
  );
}