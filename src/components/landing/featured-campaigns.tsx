import { buttonVariants } from "@heroui/styles";
import Link from "next/link";

import { Card } from "@/components/ui";

// Placeholder data — replaced by a real fetch from crowdfunding-server once
// the Campaign API exists (PLAN.md Phase 6, Task 18/19).
const featuredCampaigns = [
  {
    id: "mock-1",
    title: "Clean Water for Rural Schools",
    category: "Education",
    goal: 10000,
    raisedAmount: 6400,
  },
  {
    id: "mock-2",
    title: "Emergency Relief for Flood Victims",
    category: "Emergency",
    goal: 25000,
    raisedAmount: 18250,
  },
  {
    id: "mock-3",
    title: "Community Garden & Food Bank",
    category: "Community",
    goal: 5000,
    raisedAmount: 1200,
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FeaturedCampaigns() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold">Featured Campaigns</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          A preview of campaigns on CrowdfundX — real campaign data arrives in a later phase.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCampaigns.map((campaign) => {
            const progress = Math.min(
              100,
              Math.round((campaign.raisedAmount / campaign.goal) * 100),
            );

            return (
              <Card key={campaign.id}>
                <div className="h-32 rounded-lg bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900" />

                <Card.Header>
                  <Card.Title>{campaign.title}</Card.Title>
                  <Card.Description>{campaign.category}</Card.Description>
                </Card.Header>

                <Card.Content>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                    <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(campaign.raisedAmount)} raised of{" "}
                    {formatCurrency(campaign.goal)}
                  </p>
                </Card.Content>

                <Card.Footer>
                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className={buttonVariants({ variant: "outline", fullWidth: true })}
                  >
                    View details
                  </Link>
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
