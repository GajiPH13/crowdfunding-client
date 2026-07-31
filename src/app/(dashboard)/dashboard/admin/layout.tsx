"use client";

import { authClient } from "@/lib/auth-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  if (session?.user.role !== "admin") {
    return (
      <p className="text-gray-600 dark:text-gray-400">You don&apos;t have access to this page.</p>
    );
  }

  return <>{children}</>;
}
