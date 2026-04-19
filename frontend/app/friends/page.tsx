"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function FriendsPage() {
  const { user } = useUser();
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    fetch("/api/friends")
      .then((res) => res.json())
      .then((data) => setFriends(data.friends || []));
  }, [user]);

  return (
    <section className="px-6 pb-16 pt-6 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* HEADER (same vibe as leaderboard) */}
        <div className="rounded-[2.5rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)]">
          <div className="flex items-start justify-between gap-4">

            {/* LEFT */}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                Social
              </p>

              <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
                Friends 👥
              </h1>

              <p className="mt-2 text-sm text-on-surface-variant">
                People you’re connected with
              </p>
            </div>

            {/* RIGHT */}
            <Link
              href="/friends/add"
              className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:scale-105"
            >
              Add Friend
            </Link>

          </div>
        </div>

        {/* LIST */}
        <div className="space-y-3">

          {friends.length === 0 ? (
            <div className="rounded-[1.75rem] bg-surface-container p-5 text-sm text-on-surface-variant">
              No friends yet. Add someone to get started 👀
            </div>
          ) : (
            friends.map((friend, index) => {
              const isTop = index === 0;

              return (
                <Link
                  key={friend._id}
                  href={`/friends/${friend._id}`}
                >
                  <div
                    className={`flex items-center justify-between rounded-[1.75rem] p-4 transition hover:scale-[1.01] ${
                      isTop
                        ? "bg-secondary-container shadow-md"
                        : "bg-surface-container"
                    }`}
                  >

                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-4">

                      <span className="w-8 text-lg font-extrabold text-on-surface">
                        #{index + 1}
                      </span>

                      <img
                        src={friend.pet?.imageID || "/gator....png"}
                        alt={`${friend.username || "Friend"} pet`}
                        className="h-10 w-10 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-semibold text-on-surface">
                          {friend.username || "No username"}
                        </p>

                        <p className="text-xs text-on-surface-variant">
                          View profile →
                        </p>
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-primary">
                        {friend.booksCompleted || 0}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        books
                      </p>
                    </div>

                  </div>
                </Link>
              );
            })
          )}

        </div>

      </div>
    </section>
  );
}
