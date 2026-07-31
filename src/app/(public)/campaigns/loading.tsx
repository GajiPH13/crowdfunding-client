import { Spinner } from "@/components/ui";

export default function CampaignsLoading() {
  return (
    <main className="mx-auto flex max-w-6xl items-center justify-center px-6 py-24">
      <Spinner size="lg" />
    </main>
  );
}
