"use client";

import { CreditCard, LayoutCells, Megaphone, Percent, Persons, Target, Wallet } from "@gravity-ui/icons";
import { buttonVariants } from "@heroui/styles";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { formatCurrency } from "@/components/campaign-card";
import { StatTile } from "@/components/dashboard/stat-tile";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Analytics } from "@/types/analytics";
import type { Campaign } from "@/types/campaign";
import type { Contribution } from "@/types/contribution";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const role = session?.user.role ?? "supporter";

  const { data: analytics } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const res = await apiFetch("/analytics");
      const body = (await res.json()) as { data: Analytics };
      return body.data;
    },
    enabled: Boolean(session) && role === "admin",
  });

  const { data: myCampaigns } = useQuery({
    queryKey: ["campaigns", { creator: session?.user.id }] as const,
    queryFn: async () => {
      const res = await apiFetch(`/campaigns?creator=${session!.user.id}`);
      const body = (await res.json()) as { data: Campaign[] };
      return body.data;
    },
    enabled: Boolean(session) && role === "creator",
  });

  const { data: myContributions } = useQuery({
    queryKey: ["contributions", "me"],
    queryFn: async () => {
      const res = await apiFetch("/contributions/me");
      const body = (await res.json()) as { data: Contribution[] };
      return body.data;
    },
    enabled: Boolean(session) && role === "supporter",
  });

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back, {session.user.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Signed in as {session.user.email} ({session.user.role})
        </p>
      </div>

      {role === "admin" && analytics && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              icon={Megaphone}
              label="Active campaigns"
              value={String(analytics.summary.activeCampaigns)}
              subline={`${analytics.summary.totalCampaigns} total`}
            />
            <StatTile
              icon={Wallet}
              label="Raised (all campaigns)"
              value={formatCurrency(analytics.summary.totalRaised)}
              subline={`${analytics.summary.avgCompletionPct}% of ${formatCurrency(analytics.summary.totalGoal)} goal`}
            />
            <StatTile
              icon={Target}
              label="Avg completion"
              value={`${analytics.summary.avgCompletionPct}%`}
              subline={`${analytics.summary.fullyFundedCount} fully funded`}
            />
            <StatTile
              icon={Persons}
              label="Donors reached"
              value={String(analytics.summary.totalDonors)}
              subline={`Avg gift ${formatCurrency(analytics.summary.avgGift)}`}
            />
          </div>
          <Link
            href="/dashboard/admin/analytics"
            className={buttonVariants({ variant: "outline" })}
          >
            View full analytics
          </Link>
        </>
      )}

      {role === "creator" && myCampaigns && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              icon={LayoutCells}
              label="My campaigns"
              value={String(myCampaigns.length)}
            />
            <StatTile
              icon={Megaphone}
              label="Active"
              value={String(
                myCampaigns.filter((c) => new Date(c.deadline) >= new Date()).length,
              )}
            />
            <StatTile
              icon={Wallet}
              label="Total raised"
              value={formatCurrency(myCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0))}
            />
            <StatTile
              icon={Percent}
              label="Avg completion"
              value={
                myCampaigns.length > 0
                  ? `${Math.round(
                      (myCampaigns.reduce(
                        (sum, c) => sum + Math.min(1, c.raisedAmount / c.goal),
                        0,
                      ) /
                        myCampaigns.length) *
                        100,
                    )}%`
                  : "—"
              }
            />
          </div>
          <Link href="/dashboard/campaigns" className={buttonVariants({ variant: "outline" })}>
            View my campaigns
          </Link>
        </>
      )}

      {role === "supporter" && myContributions && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile
              icon={Wallet}
              label="Total contributed"
              value={formatCurrency(myContributions.reduce((sum, c) => sum + c.amount, 0))}
            />
            <StatTile
              icon={CreditCard}
              label="Contributions"
              value={String(myContributions.length)}
            />
            <StatTile
              icon={LayoutCells}
              label="Campaigns supported"
              value={String(new Set(myContributions.map((c) => c.campaignId)).size)}
            />
          </div>
          <Link
            href="/dashboard/contributions"
            className={buttonVariants({ variant: "outline" })}
          >
            View my contributions
          </Link>
        </>
      )}
    </div>
  );
}
