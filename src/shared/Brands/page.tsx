"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { IBrand, IProduct } from "@/Interface/brands.interface";
import { getAllBrands, getProductsByBrand } from "@/Survices/Brands/brands.services";
import AddToWishlist from "../Wishlist/AddToWishlist";
import AddBtn from "../AddBtn/AddBtn";

// import { getAllBrands, getProductsByBrand } from "@/Services/Brands/brands.service";

// import type { IBrand, IProduct } from "@/interface/brands.interface";

export default function Brands() {
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<IBrand | null>(null);

  const [brandsLoading, setBrandsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  const [brandsError, setBrandsError] = useState("");
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchBrands() {
      try {
        setBrandsLoading(true);
        setBrandsError("");

        const response = await getAllBrands();

        if (!active) return;

        setBrands(response.data ?? []);
      } catch (error) {
        if (!active) return;

        setBrandsError(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        if (active) setBrandsLoading(false);
      }
    }

    fetchBrands();

    return () => {
      active = false;
    };
  }, []);

  async function handleBrandClick(brand: IBrand) {
    setSelectedBrand(brand);
    setProducts([]);
    setProductsError("");
    setProductsLoading(true);

    try {
      const productsData = await getProductsByBrand(brand._id);
      setProducts(productsData);
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : "Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-10">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-green-600">Our Collections</p>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Explore Our <span className="text-green-600">Brands</span>
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            Discover your favorite brands and explore their latest products.
          </p>
        </header>

        {/* Brands */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Popular Brands</h2>

            {!brandsLoading && <span className="text-sm text-gray-500">{brands.length} brands</span>}
          </div>

          {brandsLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-2xl border bg-white" />
              ))}
            </div>
          ) : brandsError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              {brandsError}
              <button onClick={() => window.location.reload()} className="ml-3 font-bold underline">
                Try again
              </button>
            </div>
          ) : brands.length === 0 ? (
            <p className="rounded-xl bg-white p-6 text-gray-500">No brands found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {brands.map((brand) => {
                const isSelected = selectedBrand?._id === brand._id;

                return (
                  <button
                    key={brand._id}
                    type="button"
                    onClick={() => handleBrandClick(brand)}
                    aria-pressed={isSelected}
                    className={`group flex min-w-0 flex-col items-center justify-center rounded-2xl border bg-white p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-green-500 hover:shadow-lg ${
                      isSelected ? "border-green-600 bg-green-50 ring-2 ring-green-100" : "border-gray-200"
                    }`}>
                    <div className="relative mb-3 h-20 w-full">
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 160px"
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <h3 className="line-clamp-2 min-h-10 wrap-break-word text-sm font-bold text-gray-800 sm:text-base">
                      {brand.name}
                    </h3>

                    <span
                      className={`mt-2 text-xs font-semibold ${
                        isSelected ? "text-green-700" : "text-gray-400 group-hover:text-green-600"
                      }`}>
                      {isSelected ? "Selected" : "View Products"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Selected Brand Products */}
        {selectedBrand && (
          <section className="mt-14 scroll-mt-8">
            <div className="mb-7 flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-green-600">Brand Collection</p>

                <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{selectedBrand.name}</h2>

                <p className="mt-2 text-sm text-gray-500">Products from your selected brand</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedBrand(null);
                  setProducts([]);
                  setProductsError("");
                }}
                className="self-start rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-green-600 hover:text-green-700 sm:self-auto">
                Clear Selection
              </button>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-72 animate-pulse rounded-2xl border bg-white" />
                ))}
              </div>
            ) : productsError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                {productsError}
                <button onClick={() => handleBrandClick(selectedBrand)} className="ml-3 font-bold underline">
                  Try again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <h3 className="text-lg font-bold text-gray-800">No products found</h3>
                <p className="mt-2 text-sm text-gray-500">There are no products available for this brand.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                {products.map((product) => (
                  <article
                    key={product._id}
                    className="group relative min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative aspect-square overflow-hidden bg-white p-3">
                      <Image
                        src={product.imageCover}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-gray-800 sm:text-base">
                        {product.title}
                      </h3>

                      {product.ratingsAverage != null && (
                        <p className="mt-2 text-sm text-amber-500">
                          ★ {product.ratingsAverage.toFixed(1)}
                          {product.ratingsQuantity != null && (
                            <span className="ml-1 text-xs text-gray-400">({product.ratingsQuantity})</span>
                          )}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-lg font-extrabold text-green-700">
                          {product.priceAfterDiscount != null ? product.priceAfterDiscount : product.price} EGP
                        </span>

                        {product.priceAfterDiscount != null && product.priceAfterDiscount < product.price && (
                          <span className="text-sm text-gray-400 line-through">{product.price} EGP</span>
                        )}
                      </div>
                    </div>
                    <AddBtn productId={product._id} />
                    <div className="absolute right-3 top-3">
                      <AddToWishlist productId={product._id} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
