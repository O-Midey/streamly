"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Movie } from "../_types";
import PrimaryButton from "./PrimaryButton";

type Props = { movies: Movie[] };

export default function HeroSlider({ movies }: Props) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        autoplay={{ delay: 6000 }}
        pagination={{ clickable: true, el: ".swiper-pagination-vertical" }}
        loop
        className="h-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
              <Image
                src={`https://image.tmdb.org/t/p/original${
                  movie.backdrop_path || movie.poster_path
                }`}
                alt={movie.title}
                fill
                className="object-cover brightness-[0.4]"
              />
            </div>

            {/* Movie Info Overlay */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-20 left-8 md:left-16 max-w-[60%] text-primary z-20"
            >
              <div>
                <span className="inline-block text-xs md:text-sm mb-2 px-4 py-2 bg-[#1f1d2b]/40 rounded-full backdrop-blur-sm text-white font-medium tracking-wide">
                  {movie.first_air_date ? "TV Series" : "Movie"} ·{" "}
                  {(movie.release_date || movie.first_air_date)?.slice(0, 4)}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {movie.title || movie.name}
                </h1>
                <p className="text-base md:text-lg mb-6 line-clamp-4 text-white">
                  {movie.overview}
                </p>
                <PrimaryButton className="bg-[#ff69b4] text-white border border-[#ff69b4] px-5 py-2 rounded-lg shadow hover:bg-[#ff4da0] hover:text-white transition">
                  Watch Trailer
                </PrimaryButton>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
