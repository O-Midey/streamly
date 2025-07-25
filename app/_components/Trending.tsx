import React from "react";
import { movies } from "../_data/data";
import MovieCard from "./MovieCard";

const genreMap: { [id: number]: string } = {
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

export default function Trending() {
  return (
    <section className="w-full py-8">
      <div className="w-full mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-semibold mb-6 text-foreground">
          Trending
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {movies.results.map((movie) => {
            const genreNames = movie.genre_ids.map(
              (id) => genreMap[id] || "Unknown"
            );

            return (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                releaseDate={movie.release_date}
                genres={genreNames}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
