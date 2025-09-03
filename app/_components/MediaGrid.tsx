// app/_components/MediaGrid.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Genre, Movie } from "../_types";
import TVShow from "../_types/tvshow";
import MovieCard from "./MovieCard";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

type MediaType = "movie" | "tv";

interface MediaGridProps {
  type: MediaType;
}

export default function MediaGrid({ type }: MediaGridProps) {
  const [items, setItems] = useState<(Movie | TVShow)[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/${type}/list?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
        );
        const data = await res.json();
        if (Array.isArray(data?.genres)) {
          setGenres(data.genres);
          const map: Record<number, string> = {};
          data.genres.forEach((g: Genre) => (map[g.id] = g.name));
          setGenreMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };
    fetchGenres();
  }, [type]);

  // Fetch items
  const fetchItems = useCallback(
    async (pageNum: number, reset = false) => {
      setLoading(true);
      if (reset) setInitialLoading(true);

      try {
        const genreQuery =
          selectedGenre !== "all" ? `&with_genres=${selectedGenre}` : "";
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/${type}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&page=${pageNum}${genreQuery}&sort_by=popularity.desc`
        );
        const data = await res.json();

        setItems((prev) =>
          reset
            ? Array.isArray(data.results)
              ? data.results
              : []
            : [...prev, ...(data.results || [])]
        );
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [type, selectedGenre]
  );

  // Reset when genre changes
  useEffect(() => {
    setPage(1);
    fetchItems(1, true);
  }, [fetchItems, selectedGenre]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.8 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading, page, totalPages]);

  // Load more when page updates
  useEffect(() => {
    if (page > 1) {
      fetchItems(page);
    }
  }, [page, fetchItems]);

  // Simple skeleton loader
  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="aspect-[2/3] bg-muted rounded-lg mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <section className="w-full px-4 md:px-8 py-8 mt-40">
      {/* Header with better spacing and typography */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">
            {type === "movie" ? "Movies" : "TV Series"}
          </h2>
          {!initialLoading && items.length > 0 && (
            <p className="text-muted-foreground">
              {items.length} {type === "movie" ? "movies" : "shows"} found
            </p>
          )}
        </div>

        {/* Enhanced Genre Filter */}
        <div className="flex items-center gap-3">
          {selectedGenre !== "all" && (
            <span className="text-sm text-muted-foreground">
              Filtered by:{" "}
              <span className="font-medium text-foreground">
                {genres.find((g) => String(g.id) === selectedGenre)?.name}
              </span>
            </span>
          )}
          <Select
            value={selectedGenre}
            onValueChange={(val) => setSelectedGenre(val)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Media Grid with better loading states */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {initialLoading ? (
          // Loading skeletons
          Array.from({ length: 20 }, (_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))
        ) : items.length > 0 ? (
          items.map((item) => {
            const genreNames = item.genre_ids.map(
              (id) => genreMap[id] || "Unknown"
            );

            return (
              <MovieCard
                key={item.id}
                id={item.id}
                title={
                  type === "movie"
                    ? (item as Movie).title
                    : (item as TVShow).name
                }
                posterPath={item.poster_path}
                releaseDate={
                  type === "movie"
                    ? (item as Movie).release_date
                    : (item as TVShow).first_air_date
                }
                genres={genreNames}
              />
            );
          })
        ) : (
          // Better empty state
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No {type === "movie" ? "movies" : "TV shows"} found
            </h3>
            <p className="text-muted-foreground">
              Try selecting a different genre or check back later for new
              content.
            </p>
          </div>
        )}
      </div>

      {/* Improved loading indicator */}
      <div ref={loaderRef} className="flex justify-center mt-8">
        {loading && !initialLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading more {type === "movie" ? "movies" : "shows"}...</span>
          </div>
        )}
      </div>

      {/* End indicator */}
      {!loading && page >= totalPages && items.length > 0 && (
        <div className="flex justify-center mt-8">
          <p className="text-muted-foreground text-sm">
            You&apos;ve seen all available{" "}
            {type === "movie" ? "movies" : "shows"}
          </p>
        </div>
      )}
    </section>
  );
}
