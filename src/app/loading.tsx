import { Spinner } from "@/components/ui";

export default function Loading() {
  return (
    <main className="flex min-h-full items-center justify-center py-24">
      <Spinner size="lg" />
    </main>
  );
}
