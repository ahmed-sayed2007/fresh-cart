"use client";

import { checkoutSession } from "@/Survices/Checkout/checkoutSession.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const checkoutSchema = z.object({
  details: z.string().min(5, "Details must be at least 5 characters"),
  phone: z.string().regex(/^(010|011|012|015)[0-9]{8}$/, "Enter a valid Egyptian phone number"),
  city: z.string().min(2, "City is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const params = useParams();
  const router = useRouter();

  // لازم اسم الـ key يطابق اسم الـ dynamic folder
  const cardId = params.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      city: "",
      phone: "",
      details: "",
    },
  });

  async function handleCheckout(values: CheckoutFormValues) {
    try {
      if (typeof cardId !== "string" || !cardId.trim()) {
        throw new Error("Cart ID is missing. Check your checkout URL and route folder name.");
      }

  
     

      const response = await checkoutSession(cardId, values);

     

      // لو الـ API رجّع رابط الدفع، انتقل إليه
      if (response.session?.url) {
        router.push(response.session.url);
      } else {
        console.error("Payment URL was not returned by the API.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(handleCheckout)}
        className="w-full max-w-xl space-y-5 rounded-xl border p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center">Checkout</h1>

        <div>
          <label htmlFor="city" className="mb-2 block font-medium">
            City
          </label>
          <input
            id="city"
            type="text"
            placeholder="Enter your city"
            {...register("city")}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block font-medium">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="01xxxxxxxxx"
            {...register("phone")}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="details" className="mb-2 block font-medium">
            Details
          </label>
          <textarea
            id="details"
            rows={5}
            placeholder="Enter your address details"
            {...register("details")}
            className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />
          {errors.details && <p className="mt-1 text-sm text-red-500">{errors.details.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
          {isSubmitting ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
