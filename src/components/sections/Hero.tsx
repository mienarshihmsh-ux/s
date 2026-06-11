
"use client"

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { HeroData, HeroCarouselData } from '@/lib/types';
import Image from 'next/image';

interface HeroProps {
  hero: HeroData;
  carousel: HeroCarouselData;
}

export function Hero({ hero, carousel }: HeroProps) {
  return (
    <section 
      id="beranda" 
      className="relative w-full bg-[#0d2e1c] pt-[70px] md:pt-[80px]"
    >
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] lg:h-[calc(100vh-80px)] overflow-hidden">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="w-full h-full"
        >
          {carousel.items.map((item, index) => (
            <SwiperSlide key={index} className="relative w-full h-full flex items-center justify-center bg-[#0d2e1c]">
              <div className="relative w-full h-full max-w-7xl mx-auto">
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  className="object-contain transition-transform duration-500"
                  priority={index === 0}
                />
              </div>
              <div className="slide-caption">
                {item.caption}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="absolute inset-0 pointer-events-none z-[5] bg-gradient-to-t from-[#0d2e1c]/40 via-transparent to-transparent flex flex-col justify-center items-center text-center p-6 mt-[80px]">
        <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-headline font-bold mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] max-w-4xl tracking-tight">
          {hero.title || 'TPA AL IMAN'}
        </h1>
        <p className="text-white/95 text-lg md:text-xl lg:text-2xl max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] font-medium">
          {hero.subtitle || 'Tempat Pendidikan Al-Qur\'an'}
        </p>
      </div>
    </section>
  );
}
