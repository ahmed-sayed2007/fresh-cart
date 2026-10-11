"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaTrash, FaArrowLeft } from "react-icons/fa";

import type { IWishlistProduct } from "@/Interface/wishlist.interface";
import { getWishlistProducts, removeFromWishlist } from "@/Survices/Wishlist/wishlist.services";
import AddBtn from "@/shared/AddBtn/AddBtn";

export default function WishlistPage() {
  const [products, setProducts] = useState<IWishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadWishlist = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const result = await getWishlistProducts();
      setProducts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getWishlistProducts()
      .then((result) => { if (active) setProducts(result); })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : "Failed to load wishlist"); })
      .finally(() => { if (active) setLoading(false); });

    const handleUpdate = () => void loadWishlist(false);
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("wishlist-updated", handleUpdate);
    };
  }, [loadWishlist]);

  async function handleRemove(productId: string) {
    setRemovingId(productId);
    try {
      await removeFromWishlist(productId);
      setProducts((curr) => curr.filter((p) => p._id !== productId));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove product");
    } finally {
      setRemovingId(null);
    }
  }

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <main className="min-h-[60vh] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-9 w-56 skeleton rounded-lg" />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4">
                <div className="h-48 skeleton rounded-xl" />
                <div className="mt-4 h-4 skeleton rounded" />
                <div className="mt-2 h-3 w-1/2 skeleton rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
          <FaHeart className="text-3xl" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Couldn&apos;t load your wishlist</h1>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
        <button
          onClick={() => void loadWishlist()}
          className="rounded-xl brand-gradient px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
        >
          <FaArrowLeft className="text-xs" />
          Continue shopping
        </Link>

        {/* Header */}
        <section className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <FaHeart className="text-xl" />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                My Wishlist
              </h1>
              <p className="text-sm text-gray-500">Your saved products</p>
            </div>
          </div>
          <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-bold text-gray-700 shadow-sm">
            {products.length} {products.length === 1 ? "item" : "items"}
          </span>
        </section>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
              <FaHeart className="text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
              <p className="mt-1 text-sm text-gray-500">
                Save the products you love — they&apos;ll be waiting here.
              </p>
            </div>
            <Link
              href="/"
              className="rounded-xl brand-gradient px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white card-shadow transition-all duration-300 hover-lift"
              >
                <Link href={`/Products/${product._id}`} className="relative block overflow-hidden">
                  <div className="relative h-52 w-full bg-gray-50">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-500">
                    <FaHeart className="text-[10px]" />
                    Saved
                  </span>
                </Link>

                <div className="p-4">
                  {product.brand?.name && (
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-green-600">
                      {product.brand.name}
                    </p>
                  )}

                  <Link href={`/Products/${product._id}`}>
                    <h2 className="line-clamp-2 min-h-10 text-sm font-semibold text-gray-900 transition hover:text-green-700">
                      {product.title}
                    </h2>
                  </Link>

                  {/* Price */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-base font-extrabold text-green-700">
                      {product.priceAfterDiscount ?? product.price} EGP
                    </span>
                    {product.priceAfterDiscount != null && (
                      <span className="text-xs text-gray-400 line-through">{product.price} EGP</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1">
                      <AddBtn productId={product._id} />
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleRemove(product._id)}
                      disabled={removingId === product._id}
                      aria-label="Remove from wishlist"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                    >
                      <FaTrash className={`text-xs ${removingId === product._id ? "animate-pulse" : ""}`} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
