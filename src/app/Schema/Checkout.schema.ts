import { z } from "zod";

export const checkoutSchema = z.object({
  details: z
    .string()
    .min(5, "Details must be at least 5 characters")
    .max(200, "Details must not exceed 200 characters"),

  phone: z.string().regex(/^(010|011|012|015)[0-9]{8}$/, "Enter a valid Egyptian phone number"),

  city: z.string().min(2, "City is required").max(50, "City must not exceed 50 characters"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
