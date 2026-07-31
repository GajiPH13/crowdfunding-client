"use client";

import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Welcome back, {session.user.name}</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Signed in as {session.user.email} ({session.user.role})
      </p>
    </div>
  );
}
