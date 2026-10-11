"use client";

import { useState } from "react";
import CategoryCard from "@/shared/CategoryCard/page";
import Card from "@/shared/Card/page";
import type { Icategories } from "@/shared/CategoryCard/page";
import type { Iproduct } from "@/Interface/product.interface";

interface HomeContentProps {
  categories: Icategories[];
  products: Iproduct[];
  initialCategoryId?: string | null;
}

export default function HomeContent({ categories, products, initialCategoryId = null }: HomeContentProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId);

  return (
    <div className="w-full">
      {/* Category filter */}
      <CategoryCard
        data={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryClick={setSelectedCategoryId}
      />

      {/* Products grid */}
      <Card data={products} categoryId={selectedCategoryId} />
    </div>
  );
}
