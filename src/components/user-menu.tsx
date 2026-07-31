"use client";

import { useRouter } from "next/navigation";

import { Avatar, Dropdown } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu({ user }: { user: { name: string; email: string } }) {
  const router = useRouter();

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar>
          <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <div className="px-3 py-2 text-sm">
          <p className="font-medium">{user.name}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
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
  );
}
