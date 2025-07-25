import MovieCard from "../_components/MovieCard";
import type { Genre, TVShow } from "../_types";

export default async function TVSeriesPage() {
  let shows: TVShow[] = [];
  const genreMap: Record<number, string> = {};

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`,
      { next: { revalidate: 3600 } } // ISR caching
    );
    const data = await res.json();
    shows = Array.isArray(data?.results) ? data.results : [];
  } catch (error) {
    console.error("Failed to fetch TV shows:", error);
  }

  try {
    const genreRes = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );
    const genreData = await genreRes.json();

    if (Array.isArray(genreData?.genres)) {
      genreData.genres.forEach((genre: Genre) => {
        genreMap[genre.id] = genre.name;
      });
    }
  } catch (error) {
    console.error("Failed to fetch genre data:", error);
  }

  return (
    <section className="w-full px-4 md:px-8 py-8 mt-40">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">TV Series</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {shows.length > 0 ? (
          shows.map((show: TVShow) => {
            const genreNames = show.genre_ids.map(
              (id) => genreMap[id] || "Unknown"
            );

            return (
              <MovieCard
                key={show.id}
                id={show.id}
                title={show.name}
                posterPath={show.poster_path}
                releaseDate={show.first_air_date}
                genres={genreNames}
              />
            );
          })
        ) : (
          <p className="col-span-full text-center text-foreground">
            Unable to fetch shows 😢
          </p>
        )}
      </div>
    </section>
  );
}
