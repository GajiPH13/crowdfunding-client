import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 px-6 py-12 dark:border-gray-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="text-lg font-bold">CrowdfundX</span>
          <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
            A modern crowdfunding platform connecting creators with the people who want to help them
            succeed.
          </p>
        </div>

        <nav className="flex gap-6 text-sm">
          <Link href="/campaigns" className="hover:underline">
            Campaigns
          </Link>
          <Link href="/login" className="hover:underline">
            Log in
          </Link>
          <Link href="/register" className="hover:underline">
            Register
          </Link>
        </nav>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-sm text-gray-500">
        © {new Date().getFullYear()} CrowdfundX
      </p>
    </footer>
  );
}
