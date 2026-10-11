"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function getMyToken() {
  const cookieStore = await cookies();

  const sessionToken =
    cookieStore.get("next-auth.session-token")?.value ?? cookieStore.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    return null;
  }

  const token = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  return token;
}
