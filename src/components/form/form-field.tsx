import type { FieldError } from "react-hook-form";

export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      {children}
      {error && <span className="text-red-600">{error.message}</span>}
    </label>
  );
}
