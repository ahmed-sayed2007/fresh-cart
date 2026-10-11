"use client";

import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { addToWishlist, removeFromWishlist } from "@/Survices/Wishlist/wishlist.services";
import { toast } from "@/components/ui/toast";

interface AddToWishlistProps {
  productId: string;
  initialIsFavorite?: boolean;
  onChange?: (isFavorite: boolean) => void;
}

export default function AddToWishlist({
  productId,
  initialIsFavorite = false,
  onChange,
}: AddToWishlistProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  async function handleWishlist() {
    if (loading) return;
    setLoading(true);
    try {
      if (isFavorite) {
        await removeFromWishlist(productId);
        setIsFavorite(false);
        onChange?.(false);
        toast.add({ title: "Removed", description: "Removed from wishlist", type: "default" });
      } else {
        await addToWishlist(productId);
        setIsFavorite(true);
        onChange?.(true);
        toast.add({ title: "Saved!", description: "Added to your wishlist", type: "success" });
      }
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (error) {
      toast.add({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleWishlist}
      disabled={loading}
      aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
      title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
        isFavorite
          ? "border-red-200 bg-red-500 text-white shadow-red-100"
          : "border-gray-200 bg-white text-gray-400 hover:border-red-200 hover:text-red-500"
      }`}
    >
      <FaHeart className={`text-sm ${loading ? "animate-pulse" : ""}`} />
    </button>
  );
}
