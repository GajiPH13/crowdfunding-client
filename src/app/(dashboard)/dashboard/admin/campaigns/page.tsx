"use client";

import { useEffect, useState } from "react";

import { CampaignCard } from "@/components/campaign-card";
import { Button } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import type { Campaign } from "@/types/campaign";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);

  useEffect(() => {
    let ignore = false;

    apiFetch("/campaigns")
      .then((res) => res.json())
      .then((body: { data: Campaign[] }) => {
        if (!ignore) setCampaigns(body.data);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleDelete(id: string) {
    await apiFetch(`/campaigns/${id}`, { method: "DELETE" });
    setCampaigns((prev) => prev?.filter((campaign) => campaign._id !== id) ?? null);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Campaign Management</h1>

      {campaigns === null ? (
        <p className="text-gray-600 dark:text-gray-400">Loading…</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No campaigns yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              actions={
                <Button variant="danger" fullWidth onPress={() => handleDelete(campaign._id)}>
                  Delete
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
