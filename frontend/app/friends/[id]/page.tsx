"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { PetAvatar } from "@/components/pet-avatar";
import { Button } from "@/components/ui/button";
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
    <section className="px-6 pb-16 pt-4 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-4xl space-y-5">
        <Card className="dashboardPanel relative gap-0 p-6 text-center sm:p-7">
          <Button
            asChild
            className="secondaryAction absolute left-4 top-4 h-10 rounded-full px-4 text-sm font-bold"
            variant="outline"
          >
            <Link href="/friends">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>

          <div className="starBadge absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs">
            Lv {data.level?.level ?? 1}
          </div>

          <p className="mt-12 text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant sm:mt-2">
            Friend profile
          </p>

          <PetAvatar
            imageSrc={data.pet?.imageID || "/gator....png"}
            equippedItems={data.pet?.equippedItems}
            alt="Pet"
            className="z-10 mx-auto mt-3 h-32 w-32"
          />

          <h1 className="statValue mt-3 text-3xl">
            {data.user?.username}
          </h1>

          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Reading journey and pet companion.
          </p>
        </Card>

        <Card className="dashboardPanel gap-0 p-5 text-center sm:p-6">
          <div className="petStageGrid relative flex min-h-72 items-center justify-center rounded-[2.25rem]">
            <div className="absolute bottom-8 h-5 w-32 rounded-full bg-foreground/15 blur-md" />
            <PetAvatar
              imageSrc={data.pet?.imageID || "/gator....png"}
              equippedItems={data.pet?.equippedItems}
              alt="Pet"
              className="h-48 w-48"
            />
          </div>

          <Card className="dashboardInnerPanel mx-auto mt-4 max-w-md gap-0 p-4">
            <p className="text-sm italic leading-6 text-on-surface-variant">
              {data.pet?.quote || "No quote yet"}
            </p>
          </Card>

        </Card>

        <Card className="dashboardPanel gap-0 p-5 sm:p-6">
          <h2 className="mb-4 font-display text-2xl font-extrabold tracking-tight text-foreground">
            Recently Read
          </h2>

          {booksPreview?.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {booksPreview.map((book: any) => (
                <Card
                  key={book._id}
                  className="secondaryAction gap-0 overflow-hidden rounded-[1.4rem] p-2"
                >
                  <div className="bookCoverFrame aspect-2/3 overflow-hidden rounded-[1rem]">
                    <img
                      src={book.coverUrl || "/defbookcover-min.jpg"}
                      alt={`${book.name} cover`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-2 flex items-center gap-1 truncate text-xs font-semibold text-foreground">
                    <BookOpen className="size-3 shrink-0 text-primary" />
                    {book.name}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium text-on-surface-variant">
              No books shared yet.
            </p>
          )}
        </Card>

      </div>
    </section>
  );
}
