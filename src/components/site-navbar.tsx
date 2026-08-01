"use client";

import { buttonVariants } from "@heroui/styles";
import { Bars } from "@gravity-ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Drawer, Navbar } from "@/components/ui";
import { UserMenu } from "@/components/user-menu";
import { authClient } from "@/lib/auth-client";

export function SiteNavbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  return (
    <Navbar>
      <Navbar.Brand>
        <Link href="/" className="text-xl font-bold tracking-tight">
          CrowdfundX
        </Link>
      </Navbar.Brand>

      <div className="hidden md:block">
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
      </div>

      <Drawer isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Drawer.Trigger
          className={`${buttonVariants({ variant: "ghost", isIconOnly: true })} md:hidden`}
          aria-label="Open navigation menu"
        >
          <Bars width={20} height={20} aria-hidden />
        </Drawer.Trigger>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.Header>
                <Drawer.Heading>CrowdfundX</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body className="flex flex-col gap-2">
                <Button variant="ghost" fullWidth onPress={() => navigate("/campaigns")}>
                  Campaigns
                </Button>

                {isPending ? null : session ? (
                  <>
                    <Button variant="ghost" fullWidth onPress={() => navigate("/dashboard")}>
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      fullWidth
                      onPress={() =>
                        authClient.signOut({
                          fetchOptions: { onSuccess: () => navigate("/") },
                        })
                      }
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" fullWidth onPress={() => navigate("/login")}>
                      Log in
                    </Button>
                    <Button fullWidth onPress={() => navigate("/register")}>
                      Register
                    </Button>
                  </>
                )}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </Navbar>
  );
}
