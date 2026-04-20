"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Trophy, UserPlus } from "lucide-react";
import Link from "next/link";
import { PetAvatar } from "@/components/pet-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-4xl space-y-5">
        <Card className="dashboardPanel gap-0 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                Ranking
              </p>

              <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
                Leaderboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                See who is reading the most books this week.
              </p>
            </div>

            <Button
              asChild
              className="primaryAction h-12 shrink-0 rounded-full px-6 font-display text-base font-bold"
            >
              <Link href="/friends">
                <UserPlus className="size-4" />
                Friends
              </Link>
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          {leaderboard.length ? (
            leaderboard.map((u, index) => (
              <Card
                key={u._id}
                className="secondaryAction flex-row items-center justify-between gap-4 rounded-[1.75rem] p-4 transition-shadow duration-150 hover:shadow-[0_14px_30px_var(--card-shadow)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[1.1rem] bg-secondary-container font-display text-base font-extrabold text-on-secondary-container">
                    #{index + 1}
                  </span>

                  <PetAvatar
                    imageSrc={u.pet?.imageID || u.petImage || "/gator....png"}
                    equippedItems={u.pet?.equippedItems}
                    alt={`${u.username || "Reader"} pet`}
                    className="h-12 w-12 rounded-full"
                  />

                  <span className="min-w-0 truncate font-display text-lg font-extrabold text-foreground">
                    {u.username}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-display text-2xl font-extrabold tracking-tight text-primary">
                    {u.booksCompleted || 0}
                  </p>
                  <p className="flex items-center justify-end gap-1 text-xs font-semibold text-on-surface-variant">
                    <Trophy className="size-3.5" />
                    books
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <Card className="dashboardPanel gap-0 p-6 text-sm font-medium text-on-surface-variant">
              No leaderboard entries yet.
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
