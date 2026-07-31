import { CampaignCard } from "@/components/campaign-card";
import { apiFetch } from "@/lib/api";
import type { Campaign } from "@/types/campaign";

async function getFeaturedCampaigns(): Promise<Campaign[]> {
  const res = await apiFetch("/campaigns", { cache: "no-store" });
  if (!res.ok) return [];
  const { data } = (await res.json()) as { data: Campaign[] };
  return data.slice(0, 3);
}

export async function FeaturedCampaigns() {
  const campaigns = await getFeaturedCampaigns();

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold">Featured Campaigns</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {campaigns.length > 0
            ? "A few campaigns making a difference right now."
            : "No campaigns yet — be the first to start one."}
        </p>

        {campaigns.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
