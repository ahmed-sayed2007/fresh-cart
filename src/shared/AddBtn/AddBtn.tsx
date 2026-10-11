"use client";

import { toast } from "@/components/ui/toast";
import { addProductCart } from "@/Survices/CartAction/addProductCart.Action";
import { useState } from "react";

interface AddBtnProps {
  productId: string;
  className?: string;
}

export default function AddBtn({ productId, className = "" }: AddBtnProps) {
  const [loading, setLoading] = useState(false);

  async function addToCart() {
    if (loading) return;
    setLoading(true);
    try {
      const response = await addProductCart(productId);
      if (response.status === "success") {
        toast.add({
          title: "Added to Cart",
          description: "Product added to your cart successfully.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.add({
        title: "Out of Stock",
        description: "This item is currently out of stock.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={addToCart}
      disabled={loading}
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Adding…
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm10.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}
