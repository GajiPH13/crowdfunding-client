"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormField } from "@/components/form/form-field";
import { Button, Input, TextArea } from "@/components/ui";

const campaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  goal: z
    .string()
    .min(1, "Goal is required")
    .refine((value) => Number(value) > 0, "Goal must be greater than 0"),
  deadline: z.string().min(1, "Deadline is required"),
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;

export function CampaignForm({
  initialValues,
  submitLabel,
  onSubmit,
}: {
  initialValues?: Partial<CampaignFormValues>;
  submitLabel: string;
  onSubmit: (values: CampaignFormValues) => Promise<string | void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      category: initialValues?.category ?? "",
      goal: initialValues?.goal ?? "",
      deadline: initialValues?.deadline ?? "",
    },
  });

  async function handleFormSubmit(values: CampaignFormValues) {
    setError(null);

    const errorMessage = await onSubmit(values);
    if (errorMessage) {
      setError(errorMessage);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <FormField label="Title" error={errors.title}>
        <Input {...register("title")} />
      </FormField>

      <FormField label="Description" error={errors.description}>
        <TextArea rows={4} {...register("description")} />
      </FormField>

      <FormField label="Category" error={errors.category}>
        <Input {...register("category")} />
      </FormField>

      <FormField label="Goal (USD)" error={errors.goal}>
        <Input type="number" min={1} {...register("goal")} />
      </FormField>

      <FormField label="Deadline" error={errors.deadline}>
        <Input type="date" {...register("deadline")} />
      </FormField>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" isDisabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
