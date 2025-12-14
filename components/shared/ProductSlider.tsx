"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import SliderCard from "./SliderCard";
import { IProduct } from "@/lib/database/models/product.model";

interface Props {
  products: IProduct[];
}

export default function ProductSlider({ products }: Props) {
  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation
      loop={true}
      autoplay={{
        delay: 10000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      spaceBetween={16}
      breakpoints={{
        0: { slidesPerView: 2 },
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
      }}
      className="!py-4"
    >
      {products.map((product, idx) => (
        <SwiperSlide key={idx} className="h-auto">
          <div className="h-full border p-2 lg:p-4 rounded-md">
            <SliderCard {...product} price={String(product.price)} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
