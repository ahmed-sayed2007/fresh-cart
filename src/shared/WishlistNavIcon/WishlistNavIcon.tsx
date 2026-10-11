"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { getWishlistProducts } from "@/Survices/Wishlist/wishlist.services";

export default function WishlistNavIcon() {
  const [count, setCount] = useState(0);

  const updateCount = useCallback(async () => {
    try {
      const products = await getWishlistProducts();
      setCount(products.length);
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void updateCount();
    }, 0);

    window.addEventListener("wishlist-updated", updateCount);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("wishlist-updated", updateCount);
    };
  }, [updateCount]);

  return (
    <Link
      href="/Wishlist"
      aria-label={`Wishlist, ${count} products`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A059]/50 bg-transparent text-[#FAF9F6] transition hover:bg-[#C5A059] hover:text-[#0B192C]">
      <FaHeart className="text-xl" />

      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#0B192C]">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
