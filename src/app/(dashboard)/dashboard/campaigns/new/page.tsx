"use client";

import { useRouter } from "next/navigation";

import { CampaignForm, type CampaignFormValues } from "@/components/dashboard/campaign-form";
import { apiFetch } from "@/lib/api";

export default function NewCampaignPage() {
  const router = useRouter();

  async function handleSubmit(values: CampaignFormValues) {
    const res = await apiFetch("/campaigns", {
      method: "POST",
      body: JSON.stringify({ ...values, goal: Number(values.goal) }),
    });

    if (!res.ok) {
      const body = (await res.json()) as { message?: string };
      return body.message ?? "Unable to create campaign";
    }

    router.push("/dashboard/campaigns");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold">Create Campaign</h1>
      <div className="mt-6">
        <CampaignForm submitLabel="Create Campaign" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
