"use client";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postRegisterData } from "@/Survices/PostRegister.services";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import Link from "next/link";
import { IoIosCart } from "react-icons/io";

export interface Iregister {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

const formSchema = zod
  .object({
    name: zod.string().min(1, "Name is required"),
    email: zod
      .string()
      .min(1, "Email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"),
    password: zod
      .string()
      .min(1, "Password is required")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be 8+ chars with uppercase, lowercase, number and symbol"
      ),
    rePassword: zod
      .string()
      .min(1, "Please confirm your password"),
    phone: zod
      .string()
      .min(1, "Phone is required")
      .regex(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number"),
  })
  .refine((obj) => obj.password === obj.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

export default function Register() {
  const { handleSubmit, reset, control, formState: { isSubmitting } } = useForm<Iregister>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", rePassword: "", phone: "" },
  });

  const router = useRouter();

  async function sendData(values: Iregister) {
    try {
      const response = await postRegisterData(values);
      if (response) {
        reset();
        toast.add({ title: "Account Created!", description: "Please sign in.", type: "success" });
        router.push("/Login");
      } else {
        toast.add({ title: "Registration failed", description: "This email may already be in use.", type: "error" });
      }
    } catch {
      toast.add({ title: "Error", description: "Something went wrong. Please try again.", type: "error" });
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 card-shadow-lg">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient text-white shadow-md">
              <IoIosCart className="text-3xl" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500">Join FreshCart and start shopping</p>
          </div>

          <form onSubmit={handleSubmit(sendData)} className="space-y-4" noValidate>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                  <Input {...field} id={field.name} type="text" placeholder="John Doe" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <Input {...field} id={field.name} type="email" placeholder="you@example.com" aria-invalid={fieldState.invalid} />
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
                  <Input {...field} id={field.name} type="password" placeholder="••••••••" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="rePassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <Input {...field} id={field.name} type="password" placeholder="••••••••" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                  <Input {...field} id={field.name} type="tel" placeholder="01000000000" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl brand-gradient py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/Login" className="font-semibold text-green-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
