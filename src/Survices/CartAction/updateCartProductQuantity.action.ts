import { getMyToken } from "@/Utillitez/getMyToken";

export async function updateCartProductQuantity(count: number, productId: string) {
  const token = await getMyToken();
  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
    method: `PUT`,
    headers: {
      token: String(token?.token),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      count: count,
    }),
  });
  const payload = await response.json();
  return payload;
}
