import { authOptions } from "@/shared/next-auth/authOption";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
