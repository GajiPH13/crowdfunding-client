"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, Navbar } from "@/components/ui";
import { UserMenu } from "@/components/user-menu";
import { authClient } from "@/lib/auth-client";

export function SiteNavbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  return (
    <Navbar>
      <Navbar.Brand>
        <Link href="/" className="text-lg font-bold">
          CrowdfundX
        </Link>
      </Navbar.Brand>

      <Navbar.Content>
        <Navbar.Item>
          <Link href="/campaigns">Campaigns</Link>
        </Navbar.Item>

        {isPending ? null : session ? (
          <>
            <Navbar.Item>
              <Link href="/dashboard">Dashboard</Link>
            </Navbar.Item>
            <Navbar.Item>
              <UserMenu user={session.user} />
            </Navbar.Item>
          </>
        ) : (
          <>
            <Navbar.Item>
              <Button variant="ghost" onPress={() => router.push("/login")}>
                Log in
              </Button>
            </Navbar.Item>
            <Navbar.Item>
              <Button onPress={() => router.push("/register")}>Register</Button>
            </Navbar.Item>
          </>
        )}
      </Navbar.Content>
    </Navbar>
  );
}
