"use client";

import { buttonVariants } from "@heroui/styles";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CampaignCard } from "@/components/campaign-card";
import { Button } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Campaign } from "@/types/campaign";

export default function MyCampaignsPage() {
  const { data: session } = authClient.useSession();
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);

  useEffect(() => {
    if (!session) return;

    let ignore = false;

    apiFetch(`/campaigns?creator=${session.user.id}`)
      .then((res) => res.json())
      .then((body: { data: Campaign[] }) => {
        if (!ignore) setCampaigns(body.data);
      });

    return () => {
      ignore = true;
    };
  }, [session]);

  async function handleDelete(id: string) {
    await apiFetch(`/campaigns/${id}`, { method: "DELETE" });
    setCampaigns((prev) => prev?.filter((campaign) => campaign._id !== id) ?? null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Campaigns</h1>
        <Link href="/dashboard/campaigns/new" className={buttonVariants({ variant: "primary" })}>
          Create Campaign
        </Link>
      </div>

      {campaigns === null ? (
        <p className="text-gray-600 dark:text-gray-400">Loading…</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          You haven&apos;t created any campaigns yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              actions={
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/campaigns/${campaign._id}/edit`}
                    className={buttonVariants({ variant: "outline", fullWidth: true })}
                  >
                    Edit
                  </Link>
                  <Button variant="danger" fullWidth onPress={() => handleDelete(campaign._id)}>
                    Delete
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
