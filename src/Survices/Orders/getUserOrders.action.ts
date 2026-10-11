"use server";

import { getMyToken } from "@/Utillitez/getMyToken";
import type { Order } from "@/Interface/Orders.interface";

export async function getUserOrders(): Promise<Order[]> {
  const tokenData = await getMyToken();

  if (!tokenData?.token || !tokenData?.id) {
    throw new Error("Please login first");
  }

  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${tokenData.id}`, {
    headers: {
      token: tokenData.token,
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message ? String(payload.message) : `Failed to load orders: ${response.status}`);
  }

  // This endpoint returns either a bare array or { data: [...] } depending on account state.
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.data ?? [];
}
