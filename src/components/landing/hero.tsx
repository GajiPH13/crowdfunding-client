import { buttonVariants } from "@heroui/styles";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 text-center sm:py-32">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-indigo-100 via-purple-50 to-transparent blur-3xl dark:from-indigo-950 dark:via-purple-950/40"
      />

      <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
        Fund the ideas that matter to you
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
        CrowdfundX connects creators with supporters. Start a campaign in minutes, or back a cause
        you believe in.
      </p>

      <div className="mt-10 flex items-center justify-center gap-4">
        <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
          Start a Campaign
        </Link>
        <Link href="/campaigns" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Browse Campaigns
        </Link>
      </div>
    </section>
  );
}
