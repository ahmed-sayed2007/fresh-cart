import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/shared/Navbar/Navbar";
import Sessionprovider from "@/shared/Sessionprovider/Sessionprovider";
import { Toaster } from "@/components/ui/toast";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FreshCart — Fresh Groceries Delivered",
    template: "%s | FreshCart",
  },
  description:
    "Shop fresh groceries, top brands, and everyday essentials online. Fast delivery, great prices — only on FreshCart.",
  keywords: ["grocery", "online shopping", "fresh cart", "delivery", "egypt"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF9F6]">
        <Sessionprovider>
          <Navbar />
          <main className="flex-1 page-enter">{children}</main>
          <Toaster />
        </Sessionprovider>
      </body>
    </html>
  );
}
