import Link from "next/link";

import { Navbar } from "@/components/ui";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar>
        <Navbar.Brand>
          <Link href="/">CrowdfundX</Link>
        </Navbar.Brand>
        <Navbar.Content>
          <Navbar.Item>
            <Link href="/login">Log in</Link>
          </Navbar.Item>
          <Navbar.Item>
            <Link href="/register">Register</Link>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-gray-200 px-6 py-4 text-sm text-gray-500 dark:border-gray-800">
        © {new Date().getFullYear()} CrowdfundX
      </footer>
    </div>
  );
}
