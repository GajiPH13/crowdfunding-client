"use client";

import { buttonVariants } from "@heroui/styles";
import { Bars } from "@gravity-ui/icons";
import Link from "next/link";
import { useState } from "react";

import { Drawer } from "@/components/ui";

import type { NavItem } from "./nav-items";
import { SidebarNav } from "./sidebar-nav";

export function MobileNav({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger
        className={`${buttonVariants({ variant: "ghost", isIconOnly: true })} lg:hidden`}
        aria-label="Open navigation menu"
      >
        <Bars width={20} height={20} aria-hidden />
      </Drawer.Trigger>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.Heading>
                <Link href="/" onClick={() => setIsOpen(false)} aria-label="Go to CrowdfundX home page">
                  CrowdfundX
                </Link>
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <SidebarNav items={items} onNavigate={() => setIsOpen(false)} />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
