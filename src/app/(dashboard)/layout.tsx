import { LayoutCells } from "@gravity-ui/icons";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center gap-2 border-b border-gray-200 px-6 py-4 font-semibold dark:border-gray-800">
        <LayoutCells width={20} height={20} aria-hidden />
        <Link href="/dashboard">Dashboard</Link>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}
