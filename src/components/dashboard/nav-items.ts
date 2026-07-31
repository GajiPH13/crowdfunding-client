import { CreditCard, House, LayoutCells, Persons, Wallet } from "@gravity-ui/icons";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof House;
}

const overview: NavItem = { label: "Overview", href: "/dashboard", icon: House };

// PLAN.md roles: Supporter, Creator, Admin. Target pages for these links
// (contributions, campaigns, admin) don't exist yet — they arrive in
// Phase 6 (Campaign Module), Phase 7 (Contributions), and Phase 8 (Admin).
const navItemsByRole: Record<string, NavItem[]> = {
  supporter: [
    overview,
    { label: "My Contributions", href: "/dashboard/contributions", icon: CreditCard },
  ],
  creator: [overview, { label: "My Campaigns", href: "/dashboard/campaigns", icon: Wallet }],
  admin: [
    overview,
    { label: "Users", href: "/dashboard/admin/users", icon: Persons },
    { label: "Campaigns", href: "/dashboard/admin/campaigns", icon: LayoutCells },
  ],
};

export function getNavItems(role: string | null | undefined): NavItem[] {
  return navItemsByRole[role ?? "supporter"] ?? navItemsByRole.supporter;
}
