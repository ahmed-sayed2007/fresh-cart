"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  updateUserData,
  changeUserPassword,
  requestForgotPassword,
  type UpdateUserValues,
  type ChangePasswordValues,
} from "@/Survices/User/userProfile.action";

const updateInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number"),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rePassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords must match",
    path: ["rePassword"],
  });

type Tab = "info" | "security";

export default function Profile() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("info");

  const [infoStatus, setInfoStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [forgotStatus, setForgotStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const infoForm = useForm<UpdateUserValues>({
    mode: "onBlur",
    resolver: zodResolver(updateInfoSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
      phone: "",
    },
  });

  const { control: infoControl, handleSubmit: handleInfoSubmit, getValues: getInfoValues } = infoForm;

  const passwordForm = useForm<ChangePasswordValues>({
    mode: "onBlur",
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  const { control: passwordControl, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm } = passwordForm;

  async function onSubmitInfo(values: UpdateUserValues) {
    setInfoStatus(null);
    try {
      await updateUserData(values);
      setInfoStatus({ type: "success", message: "Your information was updated successfully." });
    } catch (error) {
      setInfoStatus({ type: "error", message: error instanceof Error ? error.message : "Update failed." });
    }
  }

  async function onSubmitPassword(values: ChangePasswordValues) {
    setPasswordStatus(null);
    try {
      await changeUserPassword(values);
      setPasswordStatus({ type: "success", message: "Your password was changed successfully." });
      resetPasswordForm();
    } catch (error) {
      setPasswordStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Password change failed.",
      });
    }
  }

  async function handleForgotPassword() {
    const email = getInfoValues("email");

    if (!email) {
      setForgotStatus({ type: "error", message: "Please enter your email address first." });
      return;
    }

    setForgotStatus(null);
    setForgotLoading(true);
    try {
      await requestForgotPassword(email);
      setForgotStatus({ type: "success", message: "A reset code has been sent to your email." });
    } catch (error) {
      setForgotStatus({ type: "error", message: error instanceof Error ? error.message : "Request failed." });
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Account Settings</h2>

      <div className="flex border-b border-gray-200 mb-8">
        <button
          type="button"
          className={`py-3 px-6 text-sm font-semibold transition-colors ${
            activeTab === "info"
              ? "border-b-2 border-green-700 text-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("info")}>
          Update Info
        </button>
        <button
          type="button"
          className={`py-3 px-6 text-sm font-semibold transition-colors ${
            activeTab === "security"
              ? "border-b-2 border-green-700 text-green-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("security")}>
          Security & Password
        </button>
      </div>

      {activeTab === "info" && (
        <form onSubmit={handleInfoSubmit(onSubmitInfo)} className="space-y-4 max-w-lg mx-auto">
          <Controller
            name="name"
            control={infoControl}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                <Input {...field} id={field.name} type="text" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={infoControl}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                <Input {...field} id={field.name} type="email" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={infoControl}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                <Input {...field} id={field.name} type="tel" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {infoStatus && (
            <p className={`text-sm ${infoStatus.type === "success" ? "text-green-700" : "text-red-600"}`}>
              {infoStatus.message}
            </p>
          )}

          <Button type="submit" disabled={infoForm.formState.isSubmitting} className="w-full">
            {infoForm.formState.isSubmitting ? "Saving Changes..." : "Update Information"}
          </Button>
        </form>
      )}

      {activeTab === "security" && (
        <div className="space-y-8 max-w-lg mx-auto">
          <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Change Password</h3>

            <Controller
              name="currentPassword"
              control={passwordControl}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                  <Input {...field} id={field.name} type="password" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={passwordControl}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                  <Input {...field} id={field.name} type="password" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="rePassword"
              control={passwordControl}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Confirm New Password</FieldLabel>
                  <Input {...field} id={field.name} type="password" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {passwordStatus && (
              <p className={`text-sm ${passwordStatus.type === "success" ? "text-green-700" : "text-red-600"}`}>
                {passwordStatus.message}
              </p>
            )}

            <Button type="submit" disabled={passwordForm.formState.isSubmitting} className="w-full">
              {passwordForm.formState.isSubmitting ? "Updating Password..." : "Change Password"}
            </Button>
          </form>

          <hr className="my-6 border-gray-200" />

          <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-800">Forgot your password?</h4>
              <p className="text-xs text-gray-500">Send a recovery code to your registered email.</p>
              {forgotStatus && (
                <p className={`text-xs mt-1 ${forgotStatus.type === "success" ? "text-green-700" : "text-red-600"}`}>
                  {forgotStatus.message}
                </p>
              )}
            </div>
            <Button type="button" variant="secondary" size="sm" disabled={forgotLoading} onClick={handleForgotPassword}>
              {forgotLoading ? "Sending..." : "Reset Code"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
