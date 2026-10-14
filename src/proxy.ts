import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = ["/Login"];

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV == `production`,
  });

  const { pathname } = request.nextUrl;
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Logged-in users can't open the login page, send them home.
  if (isAuthRoute) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected pages (cart, profile, ...) require a session.
  if (token) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/Login", request.url));
}

export const config = {
  matcher: ["/cart", "/profile", "/allorders", "/Wishlist", "/Login"],
};
