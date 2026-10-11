"use client";

import Image from "next/image";
import TitleHeader from "../TitleHeader/page";

export interface Icategories {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryCardProps {
  data: Icategories[];
  selectedCategoryId: string | null;
  onCategoryClick: (id: string | null) => void;
}

export default function CategoryCard({ data, selectedCategoryId, onCategoryClick }: CategoryCardProps) {
  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <TitleHeader title="Shop By " side="Category" />

      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
        {/* All Categories */}
        <button
          type="button"
          onClick={() => onCategoryClick(null)}
          className={`group flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
            selectedCategoryId === null
              ? "border-green-500 bg-green-50 shadow-sm"
              : "border-gray-200 bg-white hover:border-green-300"
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-2xl text-white shadow-sm">
            🛒
          </span>
          <span className="text-center text-xs font-semibold text-gray-700">All</span>
        </button>

        {data.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => onCategoryClick(cat._id)}
            className={`group flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              selectedCategoryId === cat._id
                ? "border-green-500 bg-green-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-green-300"
            }`}
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="56px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span
              className={`text-center text-xs font-semibold leading-tight ${
                selectedCategoryId === cat._id ? "text-green-700" : "text-gray-700"
              }`}
            >
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
