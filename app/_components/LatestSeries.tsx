// components/LatestMoviesSection.tsx
"use client";

import Carousel from "./Carousel";
import MovieCard from "./MovieCard";
import { movies } from "../_data/data"; // or fetched TMDB data
import { Movie } from "../_types/movies";

export default function LatestSeriesSection() {
  const latestMovies = movies.results;
  return (
    <section className="px-4 md:px-8 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">
        Latest Series
      </h2>
      <Carousel>
        {latestMovies.slice(0, 15).map((movie: Movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            releaseDate={movie.release_date}
            genres={movie.genreNames || ["genre"]}
          />
        ))}
      </Carousel>
    </section>
  );
}
