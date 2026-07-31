"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { z } from "zod";

import { FormField } from "@/components/form/form-field";
import { Button, Input } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setError(null);

    const { error: signInError } = await authClient.signIn.email(values);

    if (signInError) {
      setError(signInError.message ?? "Unable to log in");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-full max-w-sm flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Log in</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Email" error={errors.email}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </FormField>

        <FormField label="Password" error={errors.password}>
          <Input type="password" autoComplete="current-password" {...register("password")} />
        </FormField>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" isDisabled={isSubmitting} fullWidth>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <Button
        variant="outline"
        fullWidth
        onPress={() => authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })}
      >
        <FaGoogle aria-hidden />
        Continue with Google
      </Button>

      <p className="text-sm">
        No account?{" "}
        <Link href="/register" className="underline">
          Register
        </Link>
      </p>
    </main>
  );
}
