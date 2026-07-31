import { ChartColumn, CircleCheck, PersonPlus, ShieldCheck } from "@gravity-ui/icons";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Secure payments",
    description: "Your contributions are processed securely from start to finish.",
  },
  {
    icon: CircleCheck,
    title: "Verified campaigns",
    description: "Every campaign is tied to a real, authenticated creator account.",
  },
  {
    icon: PersonPlus,
    title: "Community support",
    description: "Join a growing community of creators and supporters backing real causes.",
  },
  {
    icon: ChartColumn,
    title: "Transparent tracking",
    description: "See exactly how much has been raised and how close a campaign is to its goal.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-gray-50 px-6 py-20 dark:bg-gray-900/40">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">Why Choose CrowdfundX</h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <reason.icon width={22} height={22} aria-hidden />
              </div>
              <h3 className="mt-3 font-semibold">{reason.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
