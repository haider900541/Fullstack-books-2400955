"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Scrollbar } from "swiper/modules";
import Image from "next/image";
import { IBanner } from "@/lib/database/models/banner.model";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

type BannerCarouselProps = {
  banners: IBanner[];
};

const BannerCarousel = ({ banners }: BannerCarouselProps) => {
  const slidesPerView = {
    base: 2,
    sm: 2,
    md: 3,
    lg: 5,
  };

  const bannerCount = banners.length;

  const isScrollable = bannerCount < slidesPerView.lg;

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Scrollbar]}
        loop={!isScrollable}
        autoplay={!isScrollable ? { delay: 4000 } : false}
        pagination={!isScrollable ? { clickable: true } : false}
        navigation={!isScrollable}
        scrollbar={isScrollable ? { draggable: true } : false}
        freeMode={isScrollable}
        spaceBetween={16}
        breakpoints={{
          0: {
            slidesPerView: slidesPerView.base,
          },
          640: {
            slidesPerView: slidesPerView.sm,
          },
          768: {
            slidesPerView: slidesPerView.md,
          },
          1024: {
            slidesPerView: slidesPerView.lg,
          },
        }}
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={idx}>
            <div className="aspect-[9/16] w-full overflow-hidden rounded-lg shadow-md">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerCarousel;
