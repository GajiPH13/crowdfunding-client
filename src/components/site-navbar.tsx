"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, Button, Dropdown, Navbar } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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
              <Dropdown>
                <Dropdown.Trigger>
                  <Avatar>
                    <Avatar.Fallback>{initials(session.user.name)}</Avatar.Fallback>
                  </Avatar>
                </Dropdown.Trigger>
                <Dropdown.Popover placement="bottom end">
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onAction={() =>
                        authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/") } })
                      }
                    >
                      Log out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
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
