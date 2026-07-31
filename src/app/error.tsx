"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-gray-600 dark:text-gray-400">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button onPress={reset}>Try again</Button>
    </main>
  );
}
