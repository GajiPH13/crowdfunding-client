"use client";

import { usePathname } from "next/navigation";

import { Breadcrumbs } from "@/components/ui";

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  contributions: "My Contributions",
  campaigns: "My Campaigns",
  admin: "Admin",
  users: "Users",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs>
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        return (
          <Breadcrumbs.Item key={href} {...(isLast ? {} : { href })}>
            {labels[segment] ?? segment}
          </Breadcrumbs.Item>
        );
      })}
    </Breadcrumbs>
  );
}
