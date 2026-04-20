"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PetAvatar } from "@/components/pet-avatar";
import { Card } from "@/components/ui/card";

export default function FriendProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);

      try {
        const res = await fetch(`/api/users/profile?userId=${id}`);
        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-on-surface-variant">
        Loading profile...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-on-surface-variant">
        User not found
      </div>
    );
  }

  const booksPreview = data.books?.slice(0, 6);

  return (
    <section className="px-6 pb-16 pt-6 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* HEADER (same vibe as profile) */}
        <Card className="relative rounded-[2.125rem] border-0 bg-surface-container-low p-6 text-center shadow-[0_18px_40px_var(--card-shadow)]">

          <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
            Friend Profile
          </p>

          <PetAvatar
            imageSrc={data.pet?.imageID || "/gator....png"}
            equippedItems={data.pet?.equippedItems}
            alt="Pet"
            className="z-10 mx-auto h-32 w-32"
          />

          <div className="absolute top-3 right-3 starBadge px-3 py-1 rounded-full text-sm z-10">
            Lv {data.level?.level ?? 1}
          </div>

          <h1 className="text-xl font-bold statValue mt-2">
            {data.user?.username}
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant">
            Reading journey & pet companion
          </p>

        </Card>

        {/* PET SECTION */}
        <Card className="petStage flex flex-col items-center rounded-[2.125rem] p-6 text-center shadow-[0_14px_30px_var(--card-shadow)]">

          <div className="relative flex h-48 w-48 items-center justify-center">
            <PetAvatar
              imageSrc={data.pet?.imageID || "/gator....png"}
              equippedItems={data.pet?.equippedItems}
              alt="Pet"
              className="h-48 w-48"
            />
          </div>

          <div className="mt-4 rounded-[1.5rem] bg-surface-container p-4 max-w-sm">
            <p className="text-sm text-on-surface-variant italic">
              {data.pet?.quote || "No quote yet"}
            </p>
          </div>

        </Card>

        {/* BOOKS */}
        <Card className="rounded-[2.125rem] border-0 bg-surface-container-low p-6 shadow-[0_14px_30px_var(--card-shadow)]">

          <h2 className="font-display text-xl font-extrabold mb-4">
            Recently Read
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {booksPreview?.map((book: any) => (
              <div
                key={book._id}
                className="secondaryAction overflow-hidden rounded-[1.25rem] p-2"
              >
                <img
                  src={book.coverUrl || "/defbookcover-min.jpg"}
                  alt={`${book.name} cover`}
                  className="h-28 w-full rounded-[0.9rem] object-cover"
                />
                <p className="text-xs mt-1 truncate">
                  {book.name}
                </p>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </section>
  );
}
