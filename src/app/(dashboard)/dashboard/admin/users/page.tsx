"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import type { AdminUser } from "@/types/user";

const roles = ["supporter", "creator", "admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    apiFetch("/api/auth/admin/list-users?limit=100")
      .then((res) => res.json())
      .then((body: { users: AdminUser[] }) => {
        if (!ignore) setUsers(body.users);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleRoleChange(userId: string, role: string) {
    setError(null);

    const res = await apiFetch("/api/auth/admin/set-role", {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    });

    if (!res.ok) {
      const body = (await res.json()) as { message?: string };
      setError(body.message ?? "Unable to update role");
      return;
    }

    setUsers(
      (prev) => prev?.map((user) => (user.id === userId ? { ...user, role } : user)) ?? null,
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {users === null ? (
        <p className="text-gray-600 dark:text-gray-400">Loading…</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="py-2 pr-4">{user.name}</td>
                  <td className="py-2 pr-4">{user.email}</td>
                  <td className="py-2 pr-4">
                    <select
                      value={user.role ?? "supporter"}
                      onChange={(event) => handleRoleChange(user.id, event.target.value)}
                      className="rounded-md border border-gray-300 px-2 py-1 dark:border-gray-700 dark:bg-gray-900"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
