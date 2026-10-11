"use client";

import Image from "next/image";
import React, { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function DetailsSwiper({ images }: { images: string[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="w-full">
      {/* Main Swiper */}
      <Swiper
        style={
          {
            "--swiper-navigation-color": "#16a34a",
            "--swiper-pagination-color": "#16a34a",
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        loop={true}
        thumbs={{
          swiper: thumbsSwiper,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 w-full">
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-100">
              <Image
                src={img}
                alt={`Product image ${i + 1}`}
                fill
                className="object-contain rounded-lg"
                priority={i === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails Swiper */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={3}
        freeMode={true}
        loop={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mt-4"
        breakpoints={{
          640: {
            slidesPerView: 5,
          },
          768: {
            slidesPerView: 6,
          },
        }}>
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-20 cursor-pointer rounded-lg overflow-hidden border border-gray-200">
              <Image src={img} alt={`Product thumbnail  ${i + 1}`} fill className="object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
