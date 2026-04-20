"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, UserPlus } from "lucide-react";
import { PetAvatar } from "@/components/pet-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-4xl space-y-5">
        <Card className="dashboardPanel gap-0 p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                Social
              </p>

              <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
                Friends
              </h1>

              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                People you are connected with.
              </p>
            </div>

            <Button
              asChild
              className="primaryAction h-12 shrink-0 rounded-full px-6 font-display text-base font-bold"
            >
              <Link href="/friends/add">
                <UserPlus className="size-4" />
                Add friend
              </Link>
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          {friends.length === 0 ? (
            <Card className="dashboardPanel gap-0 p-6 text-sm font-medium text-on-surface-variant">
              No friends yet. Add someone to get started.
            </Card>
          ) : (
            friends.map((friend, index) => {
              const isTop = index === 0;

              return (
                <Link
                  key={friend._id}
                  href={`/friends/${friend._id}`}
                >
                  <Card
                    className={`cursor-pointer flex-row items-center justify-between gap-4 rounded-[1.75rem] border-0 p-4 transition-colors duration-150 ${
                      isTop
                        ? "bg-secondary-container text-on-secondary-container shadow-[0_14px_30px_var(--card-shadow)]"
                        : "secondaryAction"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="w-10 shrink-0 font-display text-lg font-extrabold text-foreground">
                        #{index + 1}
                      </span>

                      <PetAvatar
                        imageSrc={friend.pet?.imageID || "/gator....png"}
                        equippedItems={friend.pet?.equippedItems}
                        alt={`${friend.username || "Friend"} pet`}
                        className="h-10 w-10 rounded-full"
                      />

                      <div className="min-w-0">
                        <p className="truncate font-display text-lg font-extrabold text-foreground">
                          {friend.username || "No username"}
                        </p>

                        <p className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
                          View profile
                          <ArrowRight className="size-3.5" />
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-display text-2xl font-extrabold tracking-tight text-primary">
                        {friend.booksCompleted || 0}
                      </p>
                      <p className="text-xs font-semibold text-on-surface-variant">
                        books
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
