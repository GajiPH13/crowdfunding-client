import type { House } from "@gravity-ui/icons";
import type { ReactNode } from "react";

import { Card } from "@/components/ui";

export function StatTile({
  icon: Icon,
  label,
  value,
  subline,
}: {
  icon: typeof House;
  label: string;
  value: string;
  subline?: ReactNode;
}) {
  return (
    <Card>
      <Card.Content className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Icon width={18} height={18} aria-hidden />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <p className="text-3xl font-semibold">{value}</p>
        {subline && <div className="text-sm text-gray-600 dark:text-gray-400">{subline}</div>}
      </Card.Content>
    </Card>
  );
}
