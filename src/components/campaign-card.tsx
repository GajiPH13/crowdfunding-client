import { buttonVariants } from "@heroui/styles";
import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "@/components/ui";
import type { Campaign } from "@/types/campaign";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CampaignCard({ campaign, actions }: { campaign: Campaign; actions?: ReactNode }) {
  const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.goal) * 100));

  return (
    <Card>
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
          {formatCurrency(campaign.raisedAmount)} raised of {formatCurrency(campaign.goal)}
        </p>
      </Card.Content>

      <Card.Footer className="flex flex-col gap-2">
        <Link
          href={`/campaigns/${campaign._id}`}
          className={buttonVariants({ variant: "outline", fullWidth: true })}
        >
          View details
        </Link>
        {actions}
      </Card.Footer>
    </Card>
  );
}
