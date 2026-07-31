"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { z } from "zod";

import { FormField } from "@/components/form/form-field";
import { Button, Input, toast } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterValues) {
    const { error: signUpError } = await authClient.signUp.email(values);

    if (signUpError) {
      toast.danger(signUpError.message ?? "Unable to register");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-full max-w-sm flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField label="Name" error={errors.name}>
          <Input type="text" autoComplete="name" {...register("name")} />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </FormField>

        <FormField label="Password" error={errors.password}>
          <Input type="password" autoComplete="new-password" {...register("password")} />
        </FormField>

        <Button type="submit" isDisabled={isSubmitting} fullWidth>
          {isSubmitting ? "Creating account…" : "Register"}
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
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
