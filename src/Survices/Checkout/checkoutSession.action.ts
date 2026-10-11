import { getMyToken } from "@/Utillitez/getMyToken";

interface CheckoutValues {
  details: string;
  phone: string;
  city: string;
}

interface CheckoutResponse {
  status: string;
  session?: {
    url?: string;
  };
  message?: string;
}

export async function checkoutSession(cartId: string, values: CheckoutValues): Promise<CheckoutResponse> {
  const tokenData = await getMyToken();

  if (!tokenData?.token) {
    throw new Error("You must be logged in to checkout");
  }

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent("https://e-commerce-kappa-inky-13.vercel.app/")}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: tokenData.token,
      },
      body: JSON.stringify({
        ShippingAddress: {
          details: values.details,
          phone: values.phone,
          city: values.city,
        },
      }),
    },
  );

  const payload: CheckoutResponse = await response.json().catch(() => ({
    status: "error",
    message: "Invalid response from server",
  }));

  if (!response.ok) {
    throw new Error(payload.message || "Checkout failed");
  }

  return payload;
}
