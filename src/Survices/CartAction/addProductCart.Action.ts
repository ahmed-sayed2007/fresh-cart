import { getMyToken } from "@/Utillitez/getMyToken";

export async function addProductCart(productId: string) {
  const token = await getMyToken();


  if (!token) {
    throw new Error("You are not authenticated");
  }

  const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    method: "POST",
    headers: {
      token: token.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Failed to add product to cart");
  }

  return payload;
}
