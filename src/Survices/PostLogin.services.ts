import type { ILogin } from "@/app/(pages)/Login/page";

export async function postLoginData(values: ILogin) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      "content-type": "application/json",
    },
  });
  // const data = await res.json();
  return res;
}
