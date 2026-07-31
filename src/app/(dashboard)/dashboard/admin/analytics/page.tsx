"use client";

import { Megaphone, Persons, Target, Wallet } from "@gravity-ui/icons";
import { useQuery } from "@tanstack/react-query";

import { CampaignCard, formatCurrency } from "@/components/campaign-card";
import { RaisedByCategoryChart } from "@/components/dashboard/charts/raised-by-category-chart";
import { RaisedOverTimeChart } from "@/components/dashboard/charts/raised-over-time-chart";
import { StatTile } from "@/components/dashboard/stat-tile";
import { Card } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import type { Analytics } from "@/types/analytics";

export default function AdminAnalyticsPage() {
  const { data: analytics } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const res = await apiFetch("/analytics");
      const body = (await res.json()) as { data: Analytics };
      return body.data;
    },
  });

  if (!analytics) {
    return <p className="text-gray-600 dark:text-gray-400">Loading…</p>;
  }

  const { summary, raisedByCategory, raisedOverTime, topCampaigns } = analytics;
  const completedCampaigns = summary.totalCampaigns - summary.activeCampaigns;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {summary.activeCampaigns} active · {completedCampaigns} completed ·{" "}
          {formatCurrency(summary.totalRaised)} raised combined
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Megaphone}
          label="Active campaigns"
          value={String(summary.activeCampaigns)}
          subline={
            summary.endingSoonCount > 0
              ? `${summary.endingSoonCount} ending within 7 days`
              : `${summary.totalCampaigns} total`
          }
        />
        <StatTile
          icon={Wallet}
          label="Raised (all campaigns)"
          value={formatCurrency(summary.totalRaised)}
          subline={`${summary.avgCompletionPct}% of ${formatCurrency(summary.totalGoal)} goal`}
        />
        <StatTile
          icon={Target}
          label="Avg completion"
          value={`${summary.avgCompletionPct}%`}
          subline={`${summary.fullyFundedCount} fully funded`}
        />
        <StatTile
          icon={Persons}
          label="Donors reached"
          value={String(summary.totalDonors)}
          subline={`Avg gift ${formatCurrency(summary.avgGift)}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>Raised over time</Card.Title>
            <Card.Description>Last 30 days</Card.Description>
          </Card.Header>
          <Card.Content>
            <RaisedOverTimeChart data={raisedOverTime} />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Raised by category</Card.Title>
            <Card.Description>Across all campaigns</Card.Description>
          </Card.Header>
          <Card.Content>
            <RaisedByCategoryChart data={raisedByCategory} />
          </Card.Content>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Top campaigns</h2>
        {topCampaigns.length === 0 ? (
          <p className="mt-2 text-gray-600 dark:text-gray-400">No campaigns yet.</p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
