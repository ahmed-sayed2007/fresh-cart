"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoIosCart } from "react-icons/io";
import { useState } from "react";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface ILogin {
  email: string;
  password: string;
}

const formSchemaLogin = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ILogin>({
    mode: "onBlur",
    resolver: zodResolver(formSchemaLogin),
    defaultValues: { email: "", password: "" },
  });

  async function sendData(values: ILogin) {
    setServerError("");
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result) {
        setServerError("No response from server. Please try again.");
        return;
      }
      if (result.error) {
        setServerError("Invalid email or password. Please try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 card-shadow-lg">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient text-white shadow-md">
              <IoIosCart className="text-3xl" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">Sign in to your FreshCart account</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(sendData)} className="space-y-4" noValidate>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl brand-gradient py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/Register" className="font-semibold text-green-700 hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
