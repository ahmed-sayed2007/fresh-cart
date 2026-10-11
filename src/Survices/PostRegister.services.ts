import type { Iregister } from "@/app/(pages)/Register/page";

export async function postRegisterData(values: Iregister) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signup`, {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      "content-type": "application/json",
    },
  });
  // const data = await res.json();

  return res.ok;
}
