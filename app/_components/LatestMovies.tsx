"use client";

import Carousel from "./Carousel";
import MovieCard from "./MovieCard";
import { movies } from "../_data/data";
import type { MovieSummary } from "../_types";

// Map of TMDb genre IDs to genre names
const genreMap: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export default function LatestMoviesSection() {
  const latestMovies: MovieSummary[] = movies.results;

  return (
    <section className="px-4 md:px-8 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">
        Latest Movies
      </h2>
      <Carousel>
        {latestMovies.slice(0, 15).map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            releaseDate={movie.release_date}
            // Map genre IDs to names safely
            genres={movie.genre_ids.map((id) => genreMap[id] || "Unknown")}
          />
        ))}
      </Carousel>
    </section>
  );
}
