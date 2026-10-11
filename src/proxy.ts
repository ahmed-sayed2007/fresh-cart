import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV == `production`,
  });

  if (token) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/Login", request.url));
  }
}

export const config = {
  matcher: ["/cart", "/profile", "/allorders", "/Wishlist"],
};
