"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
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

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>
        Signed in as {session.user.email} ({session.user.role})
      </p>
      <button
        type="button"
        onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/") } })}
        className="w-fit rounded-md border border-gray-300 px-4 py-2 dark:border-gray-700"
      >
        Log out
      </button>
    </main>
  );
}
