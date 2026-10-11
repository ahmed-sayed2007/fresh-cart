"use client";

import TitleHeader from "../TitleHeader/page";
import type { Iproduct } from "@/Interface/product.interface";
import Image from "next/image";
import Link from "next/link";
import AddBtn from "../AddBtn/AddBtn";
import AddToWishlist from "../Wishlist/AddToWishlist";

interface CardProps {
  data: Iproduct[];
  categoryId: string | null;
}

export default function Card({ data, categoryId }: CardProps) {
  const filteredProducts = categoryId
    ? data.filter((product) => product.category?._id === categoryId)
    : data;

  return (
    <section className="w-full px-4 pb-16 sm:px-6 lg:px-8">
      <TitleHeader title={categoryId ? "Category " : "Featured "} side="Products" />

      {filteredProducts.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <span className="text-5xl">🛍️</span>
          <h3 className="text-lg font-bold text-gray-700">No products found</h3>
          <p className="text-sm text-gray-500">Try selecting a different category</p>
        </div>
      ) : (
        <div className="mt-6 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredProducts.map((product) => (
            <div className="group relative" key={product._id}>
              {/* Wishlist */}
              <div className="absolute right-2.5 top-2.5 z-10">
                <AddToWishlist productId={product.id ?? product._id} />
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white card-shadow transition-all duration-300 hover-lift">
                <Link href={`/Products/${product._id}`} className="block">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-400 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-green-600">
                      {product.category?.name}
                    </span>
                    <h2 className="mt-0.5 line-clamp-2 min-h-10 text-sm font-semibold text-gray-800">
                      {product.title}
                    </h2>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-base font-extrabold text-green-700">
                        {product.price} EGP
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-amber-500">
                        ★ {product.ratingsAverage}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Add to cart */}
                <div className="px-3 pb-3">
                  <AddBtn productId={product._id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
