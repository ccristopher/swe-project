"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

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
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:scale-105"
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
              className="secondaryAction p-4 rounded-xl flex items-center justify-between"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">
                  #{index + 1}
                </span>

                {/* optional pet */}
                <img
                  src={u.petImage || "/gator....png"}
                  className="w-10 h-10"
                />

                <span className="font-semibold">
                  {u.username}
                </span>
              </div>

                  <img
                    src={u.petImage || "/gator....png"}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <span className="font-semibold text-on-surface">
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
            );
          })}
        </div>

      </div>
    </section>
  );
}