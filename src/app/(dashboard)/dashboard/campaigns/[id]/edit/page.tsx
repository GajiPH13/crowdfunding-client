"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CampaignForm, type CampaignFormValues } from "@/components/dashboard/campaign-form";
import { apiFetch } from "@/lib/api";
import type { Campaign } from "@/types/campaign";

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    apiFetch(`/campaigns/${params.id}`)
      .then((res) => res.json())
      .then((body: { data: Campaign }) => setCampaign(body.data));
  }, [params.id]);

  async function handleSubmit(values: CampaignFormValues) {
    const res = await apiFetch(`/campaigns/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...values, goal: Number(values.goal) }),
    });

    if (!res.ok) {
      const body = (await res.json()) as { message?: string };
      return body.message ?? "Unable to update campaign";
    }

    router.push("/dashboard/campaigns");
    router.refresh();
  }

  if (!campaign) {
    return <p className="text-gray-600 dark:text-gray-400">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold">Edit Campaign</h1>
      <div className="mt-6">
        <CampaignForm
          submitLabel="Save Changes"
          initialValues={{
            title: campaign.title,
            description: campaign.description,
            category: campaign.category,
            goal: String(campaign.goal),
            deadline: campaign.deadline.slice(0, 10),
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
