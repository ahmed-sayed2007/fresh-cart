"use client";

import { checkoutCash } from "@/Survices/Checkout/checkoutCash.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/toast";

const cashOnDeliverySchema = z.object({
  city: z.string().trim().min(2, "City must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^(010|011|012|015)[0-9]{8}$/, "Enter a valid Egyptian phone number"),
  details: z.string().trim().min(5, "Address must be at least 5 characters"),
  postalCode: z.string().trim().min(1, "Postal code is required"),
});

type CashOnDeliveryFormValues = z.infer<typeof cashOnDeliverySchema>;

export default function CashOnDelivery() {
  const params = useParams<{ cartId: string }>();
  const cartId = params.cartId;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CashOnDeliveryFormValues>({
    resolver: zodResolver(cashOnDeliverySchema),
    defaultValues: { city: "", phone: "", details: "", postalCode: "" },
  });

  async function handleCashOnDelivery(values: CashOnDeliveryFormValues) {
    try {
      if (!cartId || cartId === "undefined") {
        toast.add({ title: "Error", description: "Cart ID is missing", type: "error" });
        return;
      }

      const response = await checkoutCash(cartId, values);
      reset();

      sessionStorage.setItem(
        "completedOrder",
        JSON.stringify({ response, shippingAddress: values })
      );

      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.add({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        type: "error",
      });
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 placeholder:text-gray-400";

  const errorClass = "mt-1 text-xs font-medium text-red-500";

  const fields = [
    {
      id: "city" as const,
      label: "City",
      type: "text",
      placeholder: "Cairo",
    },
    {
      id: "phone" as const,
      label: "Phone Number",
      type: "tel",
      placeholder: "01000000000",
    },
    {
      id: "postalCode" as const,
      label: "Postal Code",
      type: "text",
      placeholder: "11511",
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 card-shadow-lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl">
              🚚
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Cash on Delivery</h1>
            <p className="mt-1 text-sm text-gray-500">Enter your shipping details below</p>
          </div>

          <form
            onSubmit={handleSubmit(handleCashOnDelivery)}
            className="space-y-4"
            noValidate
          >
            {fields.map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-700">
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder}
                  {...register(id)}
                  className={inputClass}
                />
                {errors[id] && (
                  <p className={errorClass}>{errors[id]?.message}</p>
                )}
              </div>
            ))}

            {/* Address details textarea */}
            <div>
              <label htmlFor="details" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Address Details
              </label>
              <textarea
                id="details"
                rows={3}
                placeholder="Street name, building number, floor, apartment..."
                {...register("details")}
                className={`${inputClass} resize-none`}
              />
              {errors.details && <p className={errorClass}>{errors.details.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl brand-gradient py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Placing Order…" : "Confirm Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
