"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { DashboardHeader } from "@/components/dashboard/header";
import { getNavItems } from "@/components/dashboard/nav-items";
import { Sidebar } from "@/components/dashboard/sidebar";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return null;
  }

  const items = getNavItems(session.user.role);

  return (
    <div className="flex min-h-full">
      <Sidebar items={items} />
      <div className="flex flex-1 flex-col">
        <DashboardHeader items={items} user={session.user} />
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
