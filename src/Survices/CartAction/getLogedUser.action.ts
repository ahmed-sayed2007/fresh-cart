import { getMyToken } from "@/Utillitez/getMyToken";

export async function getProductLog() {
  const token = await getMyToken();

  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
    headers: {
      token: String(token?.token),
    },
  });
  const payload = await response.json();
  return payload;
}
