"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
  const { data: session } = authClient.useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

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
    <main className="px-6 py-12 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Start a campaign or support one you believe in.
            </p>
          </div>

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

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            fullWidth
            onPress={() =>
              authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })
            }
          >
            <FaGoogle aria-hidden />
            Continue with Google
          </Button>

          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium underline">
              Log in
            </Link>
          </p>
        </div>

        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl shadow-xl shadow-accent/10 md:block">
          <Image
            src="https://picsum.photos/seed/crowdfundx-register/900/900"
            alt="A creator preparing to launch their campaign"
            fill
            sizes="480px"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}
