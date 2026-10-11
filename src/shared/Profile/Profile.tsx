"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { GridLoader } from "react-spinners";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  changePasswordSchema,
  profileInfoSchema,
  type ChangePasswordValues,
  type ProfileInfoValues,
} from "@/app/Schema/Profile.schema";
import {
  changeUserPassword,
  getLoggedInUser,
  requestForgotPassword,
  updateUserData,
} from "@/Survices/User/user.services";

type ProfileTab = "info" | "security";

export default function Profile() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const infoForm = useForm<ProfileInfoValues>({
    mode: "onBlur",
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const passwordForm = useForm<ChangePasswordValues>({
    mode: "onBlur",
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      setLoadingProfile(true);
      try {
        const user = await getLoggedInUser();
        infoForm.reset({
          name: user?.name ?? session?.user?.name ?? "",
          email: user?.email ?? session?.user?.email ?? "",
          phone: user?.phone ?? "",
        });
      } catch {
        infoForm.reset({
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
          phone: "",
        });
      } finally {
        setLoadingProfile(false);
      }
    }

    void loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when session identity changes
  }, [session?.user?.email, session?.user?.name]);

  async function onUpdateInfo(values: ProfileInfoValues) {
    try {
      await updateUserData(values);
      toast.add({
        title: "Success",
        description: "Information updated successfully!",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Update failed",
        type: "error",
      });
    }
  }

  async function onChangePassword(values: ChangePasswordValues) {
    try {
      await changeUserPassword(values);
      passwordForm.reset();
      toast.add({
        title: "Success",
        description: "Password changed successfully!",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Password change failed",
        description: error instanceof Error ? error.message : "Password change failed",
        type: "error",
      });
    }
  }

  async function handleForgotPassword() {
    const email = infoForm.getValues("email");
    if (!email) {
      toast.add({
        title: "Email required",
        description: "Please enter your email address first",
        type: "error",
      });
      return;
    }

    try {
      await requestForgotPassword(email);
      toast.add({
        title: "Success",
        description: "Reset code sent to your email!",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Request failed",
        description: error instanceof Error ? error.message : "Request failed",
        type: "error",
      });
    }
  }

  if (loadingProfile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <GridLoader color="#15803d" />
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 max-w-4xl rounded-xl border border-gray-100 bg-white p-6 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Account Settings</h2>

      <div className="mb-8 flex border-b border-gray-200">
        <button
          type="button"
          className={`px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === "info"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("info")}>
          Update Info
        </button>
        <button
          type="button"
          className={`px-6 py-3 text-sm font-semibold transition-colors ${
            activeTab === "security"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("security")}>
          Security & Password
        </button>
      </div>

      {activeTab === "info" && (
        <form onSubmit={infoForm.handleSubmit(onUpdateInfo)} className="mx-auto max-w-lg space-y-4">
          <Controller
            name="name"
            control={infoForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={infoForm.control}
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
            control={infoForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                <Input {...field} id={field.name} type="tel" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={infoForm.formState.isSubmitting}>
            {infoForm.formState.isSubmitting ? "Saving Changes..." : "Update Information"}
          </Button>
        </form>
      )}

      {activeTab === "security" && (
        <div className="mx-auto max-w-lg space-y-8">
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Change Password</h3>

            <Controller
              name="currentPassword"
              control={passwordForm.control}
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
              control={passwordForm.control}
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
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Confirm New Password</FieldLabel>
                  <Input {...field} id={field.name} type="password" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting ? "Updating Password..." : "Change Password"}
            </Button>
          </form>

          <hr className="border-gray-200" />

          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Forgot your password?</h4>
              <p className="text-xs text-gray-500">Send a recovery code to your registered email.</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => void handleForgotPassword()}>
              Reset Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
