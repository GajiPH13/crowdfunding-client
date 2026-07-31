import { DashboardBreadcrumb } from "./breadcrumb";
import { MobileNav } from "./mobile-nav";
import type { NavItem } from "./nav-items";
import { UserMenu } from "@/components/user-menu";

export function DashboardHeader({
  items,
  user,
}: {
  items: NavItem[];
  user: { name: string; email: string };
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <MobileNav items={items} />
        <DashboardBreadcrumb />
      </div>

      <UserMenu user={user} />
    </header>
  );
}
