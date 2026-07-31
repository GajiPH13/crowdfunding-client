import { FilePlus, Link as LinkIcon, Wallet } from "@gravity-ui/icons";

const steps = [
  {
    icon: FilePlus,
    title: "Create your campaign",
    description: "Tell your story, set a funding goal, and add photos in just a few minutes.",
  },
  {
    icon: LinkIcon,
    title: "Share with your network",
    description: "Spread the word through social media, email, and messaging to reach supporters.",
  },
  {
    icon: Wallet,
    title: "Receive funds",
    description: "Collect contributions securely and track your progress toward your goal.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gray-50 px-6 py-20 dark:bg-gray-900/40">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">How It Works</h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <step.icon width={28} height={28} aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
