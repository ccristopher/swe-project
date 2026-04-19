"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
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
        <Card className="rounded-[2.5rem] bg-surface-container-low p-6 shadow-[0_18px_40px_var(--card-shadow)] text-center">
          
          <p className="text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
            Friend Profile
          </p>

          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
            {data.user?.username || "Unknown User"}
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant">
            Reading journey & pet companion
          </p>

        </Card>

        {/* PET SECTION */}
        <Card className="rounded-[2.5rem] bg-secondary-container p-6 flex flex-col items-center text-center">
          
          <div className="relative h-40 w-40">
            <Image
              src={data.pet?.imageID || "../../../../../gator....png"}
              alt="Pet"
              fill
              className="object-contain image-pixel"
            />
          </div>

          <div className="mt-4 rounded-[1.5rem] bg-surface-container p-4 max-w-sm">
            <p className="text-sm text-on-surface-variant italic">
              {data.pet?.quote || "No quote yet"}
            </p>
          </div>

        </Card>

        {/* BOOKS */}
        <Card className="rounded-[2.5rem] bg-surface-container-low p-6">
          
          <h2 className="font-display text-xl font-extrabold mb-4">
            Recently Read
          </h2>

          {booksPreview?.length ? (
            <div className="grid grid-cols-3 gap-3">
              {booksPreview.map((book: any) => (
                <div key={book._id} className="space-y-2">

                  <div className="aspect-[2/3] overflow-hidden rounded-xl bg-surface-container">
                    <img
                      src={book.coverUrl || "/defbookcover-min.jpg"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="text-[10px] text-center text-on-surface-variant truncate">
                    {book.name}
                  </p>

                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              No books yet
            </p>
          )}

        </Card>

      </div>
    </section>
  );
}