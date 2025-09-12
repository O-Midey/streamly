// Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  poster_path: string;
  backdrop_path: string;
  genres: Genre[];
  budget: number;
  revenue: number;
  original_language: string;
  popularity: number;
  tagline: string;
  status: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface Videos {
  results: Video[];
}

interface Image {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
}

export interface Images {
  backdrops: Image[];
  posters: Image[];
}

export interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

export interface SimilarMovies {
  results: SimilarMovie[];
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviders {
  results: {
    [countryCode: string]: {
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    };
  };
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    rating: number | null;
    avatar_path: string | null;
  };
}

export interface Reviews {
  results: Review[];
}
