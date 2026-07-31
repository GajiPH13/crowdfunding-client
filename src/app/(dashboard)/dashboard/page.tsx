"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui";
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
    <main className="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>
        Signed in as {session.user.email} ({session.user.role})
      </p>
      <Button
        variant="outline"
        onPress={() => authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/") } })}
        className="w-fit"
      >
        Log out
      </Button>
    </main>
  );
}
