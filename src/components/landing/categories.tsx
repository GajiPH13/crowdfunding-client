import {
  Alarm,
  Cpu,
  GraduationCap,
  Gift,
  HeartPulse,
  PlanetEarth,
  Persons,
} from "@gravity-ui/icons";

const categories = [
  { icon: HeartPulse, label: "Medical" },
  { icon: Alarm, label: "Emergency" },
  { icon: GraduationCap, label: "Education" },
  { icon: Persons, label: "Community" },
  { icon: PlanetEarth, label: "Environment" },
  { icon: Cpu, label: "Technology" },
  { icon: Gift, label: "Charity" },
];

export function Categories() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">Browse by Category</h2>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.label}
              className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 px-4 py-6 text-center dark:border-gray-800"
            >
              <category.icon width={24} height={24} aria-hidden />
              <span className="font-medium">{category.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
