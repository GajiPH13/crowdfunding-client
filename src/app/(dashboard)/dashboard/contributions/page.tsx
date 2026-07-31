"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { formatCurrency } from "@/components/campaign-card";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Contribution } from "@/types/contribution";

export default function MyContributionsPage() {
  const { data: session } = authClient.useSession();

  const { data: contributions } = useQuery({
    queryKey: ["contributions", "me"],
    queryFn: async () => {
      const res = await apiFetch("/contributions/me");
      const body = (await res.json()) as { data: Contribution[] };
      return body.data;
    },
    enabled: Boolean(session),
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">My Contributions</h1>

      {contributions === undefined ? (
        <p className="text-gray-600 dark:text-gray-400">Loading…</p>
      ) : contributions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          You haven&apos;t contributed to any campaigns yet.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
          {contributions.map((contribution) => (
            <div key={contribution._id} className="flex items-center justify-between py-4">
              <div>
                {contribution.campaign ? (
                  <Link
                    href={`/campaigns/${contribution.campaign._id}`}
                    className="font-medium hover:underline"
                  >
                    {contribution.campaign.title}
                  </Link>
                ) : (
                  <span className="font-medium">Unknown campaign</span>
                )}
                {contribution.campaign && (
                  <p className="text-sm text-gray-500">{contribution.campaign.category}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(contribution.amount)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(contribution.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
