"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import type { AdminUser } from "@/types/user";

const roles = ["supporter", "creator", "admin"];
const queryKey = ["admin", "users"];

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiFetch("/api/auth/admin/list-users?limit=100");
      const body = (await res.json()) as { users: AdminUser[] };
      return body.users;
    },
  });

  const setRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await apiFetch("/api/auth/admin/set-role", {
        method: "POST",
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { message?: string };
        throw new Error(body.message ?? "Unable to update role");
      }
    },
    onMutate: async ({ userId, role }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<AdminUser[]>(queryKey);
      queryClient.setQueryData<AdminUser[]>(queryKey, (prev) =>
        prev?.map((user) => (user.id === userId ? { ...user, role } : user)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      {setRoleMutation.isError && (
        <p className="text-sm text-red-600">{setRoleMutation.error.message}</p>
      )}

      {users === undefined ? (
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
                      onChange={(event) =>
                        setRoleMutation.mutate({ userId: user.id, role: event.target.value })
                      }
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
