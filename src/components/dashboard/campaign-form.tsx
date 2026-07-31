"use client";

import { useState, type FormEvent } from "react";

import { Button, Input, TextArea } from "@/components/ui";

export interface CampaignFormValues {
  title: string;
  description: string;
  category: string;
  goal: string;
  deadline: string;
}

export function CampaignForm({
  initialValues,
  submitLabel,
  onSubmit,
}: {
  initialValues?: Partial<CampaignFormValues>;
  submitLabel: string;
  onSubmit: (values: CampaignFormValues) => Promise<string | void>;
}) {
  const [values, setValues] = useState<CampaignFormValues>({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    category: initialValues?.category ?? "",
    goal: initialValues?.goal ?? "",
    deadline: initialValues?.deadline ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof CampaignFormValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const errorMessage = await onSubmit(values);

    setIsSubmitting(false);
    if (errorMessage) {
      setError(errorMessage);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Title
        <Input
          required
          value={values.title}
          onChange={(event) => update("title", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <TextArea
          required
          rows={4}
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Category
        <Input
          required
          value={values.category}
          onChange={(event) => update("category", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Goal (USD)
        <Input
          required
          type="number"
          min={1}
          value={values.goal}
          onChange={(event) => update("goal", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Deadline
        <Input
          required
          type="date"
          value={values.deadline}
          onChange={(event) => update("deadline", event.target.value)}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" isDisabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
