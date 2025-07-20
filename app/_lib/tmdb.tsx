export async function getLatestMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US&page=1`,
    {
      next: { revalidate: 3600 }, // ISR - revalidate every hour
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch latest movies");
  }

  const data = await res.json();
  return data.results; // array of movie objects
}
