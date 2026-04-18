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

    const interval = setInterval(fetchLeaderboard, 60000); // refresh every minute (testing)

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-md md:max-w-2xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link
            href="/profile"
            className="primaryAction px-4 py-2 rounded-full text-sm"
          >
            ← Back
          </Link>

          <h1 className="text-2xl font-bold statValue">
            Leaderboard 🏆
          </h1>
        </div>

        {/* LEADERBOARD LIST */}
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

              {/* RIGHT SIDE */}
              <div className="text-right">
                <p className="statValue font-bold">
                  {u.booksCompleted || 0}
                </p>
                <p className="text-xs progressLabel">
                  books
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}