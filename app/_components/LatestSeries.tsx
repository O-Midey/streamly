"use client";

import Carousel from "./Carousel";
import MovieCard from "./MovieCard";
import { movies } from "../_data/data";

interface MovieSummary {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
}

export default function LatestSeriesSection() {
  const latestSeries: MovieSummary[] = movies.results;

  return (
    <section className="px-4 md:px-8 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">
        Latest Series
      </h2>
      <Carousel>
        {latestSeries.slice(0, 15).map((series) => (
          <MovieCard
            key={series.id}
            id={series.id}
            title={series.title}
            posterPath={series.poster_path}
            releaseDate={series.release_date}
            genres={series.genre_ids.map((id) => String(id)) || ["genre"]}
          />
        ))}
      </Carousel>
    </section>
  );
}
