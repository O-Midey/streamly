"use client";

import Link from "next/link";
import Image from "next/image";

type MovieCardProps = {
  id: number;
  title: string; // can be title or name
  posterPath: string;
  releaseDate: string; // release_date or first_air_date
  genres?: string[];
  type?: "movie" | "tv";
};

export default function MovieCard({
  id,
  title,
  posterPath,
  releaseDate,
  genres = [],
  type,
}: MovieCardProps) {
  if (!type) type = "movie"; // default to movie if type is not provided
  const releaseYear = new Date(releaseDate).getFullYear();

  return (
    <Link
      href={`/movie/${id}`}
      className="relative w-full aspect-[2/3] rounded-sm overflow-hidden group shadow-md transition-transform duration-300"
    >
      <Image
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={title}
        width={300}
        height={450}
        className="object-cover transition-transform group-hover:scale-105 duration-300 brightness-[0.45]"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#ff69b4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Text Overlay */}
      <div className="absolute bottom-0 w-full p-3 z-20 font-bold text-white">
        <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
        <div className="flex flex-wrap gap-2 mt-1 text-xs ">
          <span className="bg-[#ff69b4]/30 border border-white/20 px-2 py-0.5 rounded-full ">
            {releaseYear}
          </span>
          {genres &&
            genres.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="bg-white/10 border border-white/20 px-2 py-0.5 rounded-full"
              >
                {genre}
              </span>
            ))}
        </div>
      </div>
    </Link>
  );
}
