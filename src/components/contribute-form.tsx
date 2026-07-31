"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button, Input } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export function ContributeForm({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await apiFetch("/contributions", {
      method: "POST",
      body: JSON.stringify({ campaignId, amount: Number(amount) }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const body = (await res.json()) as { message?: string };
      setError(body.message ?? "Unable to process contribution");
      return;
    }

    setAmount("");
    setSuccess(true);
    router.refresh();
  }

  if (isPending) {
    return null;
  }

  if (!session) {
    return (
      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <Link href="/login" className="underline">
            Log in
          </Link>{" "}
          to contribute to this campaign.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
        <p className="text-sm text-green-800 dark:text-green-300">
          Thank you for your contribution!
        </p>
        <Button variant="ghost" className="mt-2" onPress={() => setSuccess(false)}>
          Contribute again
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
    >
      <label className="flex flex-col gap-1 text-sm">
        Contribution amount (USD)
        <Input
          required
          type="number"
          min={1}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" isDisabled={isSubmitting}>
        {isSubmitting ? "Processing…" : "Contribute"}
      </Button>
    </form>
  );
}
