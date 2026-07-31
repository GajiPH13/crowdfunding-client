import { CampaignCard } from "@/components/campaign-card";
import { apiFetch } from "@/lib/api";
import type { Campaign } from "@/types/campaign";

async function getCampaigns(): Promise<Campaign[]> {
  const res = await apiFetch("/campaigns", { cache: "no-store" });
  if (!res.ok) return [];
  const { data } = (await res.json()) as { data: Campaign[] };
  return data;
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Campaigns</h1>

      {campaigns.length === 0 ? (
        <p className="mt-6 text-gray-600 dark:text-gray-400">
          No campaigns yet — be the first to start one.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </main>
  );
}
