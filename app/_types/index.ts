export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  first_air_date?: string;
  name?: string;
  genreNames?: string[];
};

export type TVShow = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  genre_ids: number[];
};

export type Genre = {
  id: number;
  name: string;
};
