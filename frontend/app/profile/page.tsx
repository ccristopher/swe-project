"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user } = useUser();

  const [data, setData] = useState<any>(null);
  const [quote, setQuote] = useState("");

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

            <Button className="primaryAction">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {booksPreview?.map((book: any) => (
              <div
                key={book._id}
                className="secondaryAction rounded-lg overflow-hidden"
              >
                <img
                  src={book.cover}
                  className="w-full h-32 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}