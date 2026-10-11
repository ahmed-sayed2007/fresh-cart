import "swiper/css/navigation";
import "swiper/css/pagination";

import MainSwiper from "../shared/MainSwiper/page";
import HomeContent from "../shared/HomeContent";

import { getAllCategory } from "@/Survices/GetAllCategory.Services";
import { getAllProducts } from "@/Survices/GetAllProducts.Services";

export const metadata = {
  title: "FreshCart — Fresh Groceries Delivered",
  description:
    "Shop fresh groceries, top brands and everyday essentials. Fast delivery, great prices.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, products] = await Promise.all([
    getAllCategory(),
    getAllProducts(),
  ]);

  return (
    <>
      <MainSwiper />
      <HomeContent key={category ?? "all"} initialCategoryId={category ?? null} categories={categories} products={products} />
    </>
  );
}
