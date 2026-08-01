import { buttonVariants } from "@heroui/styles";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-24">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-accent/10 to-transparent blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Fund the ideas that matter to you
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
            CrowdfundX connects creators with supporters. Start a campaign in minutes, or back a
            cause you believe in.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/register" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Start a Campaign
            </Link>
            <Link href="/campaigns" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Browse Campaigns
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl shadow-accent/10 md:aspect-square">
          <Image
            src="https://picsum.photos/seed/crowdfundx-supporters/900/900"
            alt="A supporter and a creator celebrating a funded campaign"
            fill
            priority
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
