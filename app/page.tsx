import HeroSlider from "./_components/HeroSlider";
import LatestMoviesSection from "./_components/LatestMovies";
import LatestSeriesSection from "./_components/LatestSeries";
import Trending from "./_components/Trending";
import { movies } from "./_data/data";
import type { Movie } from "./_types";

export default async function HomePage() {
  const topMovies: Movie[] = movies.results.slice(0, 10); // Limit to top 5

  return (
    <main>
      <HeroSlider movies={topMovies} />
      <Trending />
      <LatestMoviesSection />
      <LatestSeriesSection />
    </main>
  );
}
