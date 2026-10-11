"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import img1 from "../../assets/different-products-basket-counter-grocery-store-different-products-basket-counter-grocery-store-decorated-470919937.webp";
import img2 from "../../assets/images (1).jpg";
import img3 from "../../assets/images (2).jpg";
import img4 from "../../assets/images.jpg";
import img5 from "../../assets/premium_photo-1679913792906-13ccc5c84d44.avif";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const imagesList = [
  { image: img1, label: "Fresh Groceries" },
  { image: img2, label: "Top Deals" },
  { image: img3, label: "New Arrivals" },
  { image: img4, label: "Best Sellers" },
  { image: img5, label: "Premium Products" },
];

export default function MainSwiper() {
  return (
    <section className="relative w-full overflow-hidden">
      <Swiper
        className="w-full"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ dynamicBullets: true, clickable: true }}
        navigation={true}
        modules={[Navigation, Pagination, Autoplay]}
      >
        {imagesList.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[340px] w-full sm:h-[420px] lg:h-[500px]">
              <Image
                src={item.image}
                alt={item.label}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

              {/* Slide content */}
              <div className="absolute bottom-10 left-8 sm:left-16 text-white">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                  FreshCart Collection
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  {item.label}
                </h2>
                <p className="mt-2 text-sm text-white/80">
                  Discover the finest quality products
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
