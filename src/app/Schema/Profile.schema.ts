import { z } from "zod";

export const profileInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^01[0125][0-9]{8}$/, "Egyptian phone number required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    password: z.string().min(6, "Minimum 6 characters").min(1, "New password required"),
    rePassword: z.string().min(1, "Confirm password"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords must match",
    path: ["rePassword"],
  });

export type ProfileInfoValues = z.infer<typeof profileInfoSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
