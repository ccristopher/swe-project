"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { PetAvatar } from "@/components/pet-avatar";

export default function LeaderboardPage() {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchLeaderboard = () => {
      fetch("/api/leaderboard")
        .then((res) => res.json())
        .then((data) => setLeaderboard(data.leaderboard));
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60000);

    return () => clearInterval(interval);
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
                Ranking
              </p>

              <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
                Leaderboard 🏆
              </h1>

              <p className="mt-2 text-sm text-on-surface-variant">
                See who’s reading the most books this week.
              </p>
            </div>

            {/* RIGHT (ADD FRIEND) */}
            <Link
              href="/friends"
              className="primaryAction shrink-0 cursor-pointer rounded-full px-5 py-2 font-display text-sm font-bold text-accent-foreground"
            >
              Add Friend
            </Link>

          </div>
        </div>

        {/* LEADERBOARD */}
        <div className="space-y-3">
          {leaderboard.map((u, index) => (
            <div
              key={u._id}
              className="secondaryAction flex items-center justify-between rounded-[1.75rem] p-4"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">
                  #{index + 1}
                </span>

                {/* optional pet */}
                <PetAvatar
                  imageSrc={u.pet?.imageID || u.petImage || "/gator....png"}
                  equippedItems={u.pet?.equippedItems}
                  alt={`${u.username || "Reader"} pet`}
                  className="h-10 w-10 rounded-full"
                />

                <span className="font-semibold">
                  {u.username}
                </span>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-lg font-extrabold text-primary">
                  {u.booksCompleted || 0}
                </p>
                <p className="text-xs text-on-surface-variant">
                  books
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
