import { getMyToken } from "@/Utillitez/getMyToken";

export async function deleteProductCart(productId: string) {
  const token = await getMyToken();

  if (!token?.token) {
    throw new Error("You are not authenticated");
  }

  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
    method: "DELETE",
    headers: {
      token: token.token,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || "Failed to delete product");
  }

  return payload;
}
