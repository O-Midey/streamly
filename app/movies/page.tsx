"use client";

import { useState, useMemo } from "react";
import MovieCard from "../_components/MovieCard";
import { movies } from "../_data/data"; // adjust to your path

// TMDb Genre Map (add more if needed)
const genresMap: { [key: number]: string } = {
  28: "Action",
  35: "Comedy",
  18: "Drama",
  27: "Horror",
  10749: "Romance",
  16: "Animation",
  878: "Sci-Fi",
  12: "Adventure",
  80: "Crime",
};

const MOVIES_PER_PAGE = 20;

export default function MoviesPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMovies = useMemo(() => {
    const base = selectedGenre
      ? movies.results.filter((movie) =>
          movie.genre_ids.some((id) => genresMap[id] === selectedGenre)
        )
      : movies.results;

    return base;
  }, [selectedGenre]);

  const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE
  );

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre((prev) => (prev === genre ? null : genre));
    setCurrentPage(1); // Reset pagination on genre change
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="w-full  mx-auto px-4 md:px-8 py-12 mt-40">
      <h1 className="text-3xl font-bold mb-6 text-foreground">All Movies</h1>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {Object.values(genresMap).map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreSelect(genre)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              selectedGenre === genre
                ? "bg-pink-500 text-white border-pink-500"
                : "border-foreground/30 text-foreground hover:border-pink-400"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {paginatedMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            releaseDate={movie.release_date}
            genres={movie.genre_ids.map((id) => genresMap[id])}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-10 flex justify-center items-center gap-3">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm rounded bg-muted disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-4 py-2 rounded-full text-sm ${
                currentPage === page
                  ? "bg-pink-500 text-white"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm rounded bg-muted disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
