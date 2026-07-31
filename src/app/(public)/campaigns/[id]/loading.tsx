import { Spinner } from "@/components/ui";

export default function CampaignDetailsLoading() {
  return (
    <main className="mx-auto flex max-w-3xl items-center justify-center px-6 py-24">
      <Spinner size="lg" />
    </main>
  );
}
