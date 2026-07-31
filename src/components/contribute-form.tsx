"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormField } from "@/components/form/form-field";
import { Button, Input, toast } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const contributeSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((value) => Number(value) > 0, "Amount must be greater than 0"),
});

type ContributeValues = z.infer<typeof contributeSchema>;

export function ContributeForm({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContributeValues>({ resolver: zodResolver(contributeSchema) });

  async function onSubmit(values: ContributeValues) {
    const res = await apiFetch("/contributions", {
      method: "POST",
      body: JSON.stringify({ campaignId, amount: Number(values.amount) }),
    });

    if (!res.ok) {
      const body = (await res.json()) as { message?: string };
      toast.danger(body.message ?? "Unable to process contribution");
      return;
    }

    reset();
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
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
    >
      <FormField label="Contribution amount (USD)" error={errors.amount}>
        <Input type="number" min={1} {...register("amount")} />
      </FormField>

      <Button type="submit" isDisabled={isSubmitting}>
        {isSubmitting ? "Processing…" : "Contribute"}
      </Button>
    </form>
  );
}
