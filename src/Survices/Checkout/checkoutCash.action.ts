"use server";

import { getMyToken } from "@/Utillitez/getMyToken";

export interface CashOnDeliveryValues {
  city: string;
  phone: string;
  details: string;
  postalCode: string;
}

export interface CashOnDeliveryResponse {
  status?: string;
  message?: string;
  data?: unknown;
  [key: string]: unknown;
}

export async function checkoutCash(cartId: string, values: CashOnDeliveryValues): Promise<CashOnDeliveryResponse> {
  if (!cartId || cartId === "undefined") {
    throw new Error("Invalid Cart ID");
  }

  const tokenData = await getMyToken();

  if (!tokenData?.token) {
    throw new Error("Please login first");
  }

  const response = await fetch(`https://ecommerce.routemisr.com/api/v2/orders/${cartId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: tokenData.token,
    },
    body: JSON.stringify({
      shippingAddress: {
        details: values.details,
        phone: values.phone,
        city: values.city,
        postalCode: values.postalCode,
      },
    }),
  });

  const payload: CashOnDeliveryResponse = await response.json().catch(() => ({
    message: "Invalid response from server",
  }));

  if (!response.ok) {
    throw new Error(payload.message ? String(payload.message) : `Checkout failed: ${response.status}`);
  }

  return payload;
}
