"use client";

import { usePathname } from "next/navigation";

import { Breadcrumbs } from "@/components/ui";

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  contributions: "My Contributions",
  campaigns: "My Campaigns",
  admin: "Admin",
  analytics: "Analytics",
  users: "Users",
  new: "New",
  edit: "Edit",
};

// Some segments (e.g. "campaigns") mean something different depending on
// where they appear — override by full path when the plain segment label
// would be misleading.
const pathOverrides: Record<string, string> = {
  "/dashboard/admin/campaigns": "Campaigns",
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
            {pathOverrides[href] ?? labels[segment] ?? segment}
          </Breadcrumbs.Item>
        );
      })}
    </Breadcrumbs>
  );
}
