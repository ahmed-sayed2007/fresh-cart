import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

declare module "next-auth" {
  interface User {
    id: string;
    token: string;
  }

  interface Session {
    user: {
      id: string;
      token: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    token: string;
  }
}

interface DecodedToken {
  id?: string;
  [key: string]: unknown;
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Login",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },

        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

     

          if (!response.ok || !data?.token) {
            return null;
          }

          const decoded = jwtDecode<DecodedToken>(data.token);

          const userId = decoded.id ?? "";

          if (!userId) {
            return null;
          }

          const user: User = {
            id: userId,
            email: data?.user?.email ?? String(credentials.email),
            name: data?.user?.name ?? "",
            token: data.token,
          };

          return user;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/Login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id ?? "";
      session.user.token = token.token ?? "";

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
