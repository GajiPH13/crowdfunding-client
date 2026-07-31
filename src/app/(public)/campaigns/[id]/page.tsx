import Image from "next/image";
import { notFound } from "next/navigation";

import { formatCurrency } from "@/components/campaign-card";
import { ContributeForm } from "@/components/contribute-form";
import { apiFetch } from "@/lib/api";
import type { Campaign } from "@/types/campaign";

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await apiFetch(`/campaigns/${id}`, { cache: "no-store" });

  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error("Failed to load campaign");
  }

  const { data: campaign } = (await res.json()) as { data: Campaign };
  const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.goal) * 100));

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-gray-500">{campaign.category}</p>
      <h1 className="mt-1 text-3xl font-bold">{campaign.title}</h1>

      {campaign.image ? (
        <div className="relative mt-6 h-56 w-full overflow-hidden rounded-lg">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="mt-6 h-56 rounded-lg bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900" />
      )}

      <div className="mt-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {formatCurrency(campaign.raisedAmount)} raised of {formatCurrency(campaign.goal)} ·
          Deadline {new Date(campaign.deadline).toLocaleDateString()}
        </p>
      </div>

      <p className="mt-6 whitespace-pre-wrap">{campaign.description}</p>

      <div className="mt-8 max-w-sm">
        <ContributeForm campaignId={campaign._id} />
      </div>
    </main>
  );
}
