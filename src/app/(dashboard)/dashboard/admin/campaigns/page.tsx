"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CampaignCard } from "@/components/campaign-card";
import { Button } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import type { Campaign } from "@/types/campaign";

const queryKey = ["campaigns", "all"];

export default function AdminCampaignsPage() {
  const queryClient = useQueryClient();

  const { data: campaigns } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiFetch("/campaigns");
      const body = (await res.json()) as { data: Campaign[] };
      return body.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch(`/campaigns/${id}`, { method: "DELETE" }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Campaign[]>(queryKey);
      queryClient.setQueryData<Campaign[]>(queryKey, (prev) =>
        prev?.filter((campaign) => campaign._id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Campaign Management</h1>

      {campaigns === undefined ? (
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
                <Button
                  variant="danger"
                  fullWidth
                  onPress={() => deleteMutation.mutate(campaign._id)}
                >
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
