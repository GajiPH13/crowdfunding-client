"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buttonVariants } from "@heroui/styles";
import Link from "next/link";

import { CampaignCard } from "@/components/campaign-card";
import { Button, toast } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Campaign } from "@/types/campaign";

export default function MyCampaignsPage() {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const queryKey = ["campaigns", { creator: session?.user.id }] as const;

  const { data: campaigns } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiFetch(`/campaigns?creator=${session!.user.id}`);
      const body = (await res.json()) as { data: Campaign[] };
      return body.data;
    },
    enabled: Boolean(session),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Unable to delete campaign");
      }
    },
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
      toast.danger("Unable to delete campaign");
    },
    onSuccess: () => {
      toast.success("Campaign deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Campaigns</h1>
        <Link href="/dashboard/campaigns/new" className={buttonVariants({ variant: "primary" })}>
          Create Campaign
        </Link>
      </div>

      {campaigns === undefined ? (
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
                  <Button
                    variant="danger"
                    fullWidth
                    onPress={() => deleteMutation.mutate(campaign._id)}
                  >
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
