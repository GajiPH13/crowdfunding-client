import type { NavItem } from "./nav-items";
import { SidebarNav } from "./sidebar-nav";

export function Sidebar({ items }: { items: NavItem[] }) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-200 p-4 lg:block dark:border-gray-800">
      <SidebarNav items={items} />
    </aside>
  );
}
