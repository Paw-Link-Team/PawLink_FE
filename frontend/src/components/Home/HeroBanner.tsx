import type { FC } from "react";
import type { SwiperOptions } from "swiper/types";

import {Swiper, SwiperSlide} from "swiper/react";
import { Autoplay, Pagination } from 'swiper/modules';

import "swiper/css";
import "swiper/css/pagination"

interface ImageSlideProps{
  images: string[];
}

export default function HeroBanner({ images }: ImageSlideProps) {
  return (
    <section className="home-hero">
      <div className="home-hero-image">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={10}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img} alt={`banner-${index}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}