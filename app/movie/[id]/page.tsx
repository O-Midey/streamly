// app/movie/[id]/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Play,
  Pause,
  Star,
  Heart,
  Share2,
  Clock,
  Calendar,
  Globe,
  Users,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  MessageCircle,
  ExternalLink,
  Award,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Credits,
  Images,
  Movie,
  Reviews,
  SimilarMovies,
  Videos,
  WatchProviders,
} from "../../_types";
import { formatCurrency, formatDate, formatRuntime } from "@/app/utils/helpers";
import Carousel from "@/app/_components/Carousel";

const MovieDetailsPage: React.FC = () => {
  const params = useParams();
  const movieId = params?.id as string;

  // State
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [videos, setVideos] = useState<Videos | null>(null);
  const [images, setImages] = useState<Images | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovies | null>(
    null
  );
  const [watchProviders, setWatchProviders] = useState<WatchProviders | null>(
    null
  );
  const [reviews, setReviews] = useState<Reviews | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "cast" | "media" | "reviews"
  >("overview");
  const [, setCurrentImageIndex] = useState(0);

  // Media tab trailer button state
  const [showTrailerButton, setShowTrailerButton] = useState(true);
  const [trailerTimer, setTrailerTimer] = useState<NodeJS.Timeout | null>(null);

  // Refs
  const castScrollRef = useRef<HTMLDivElement>(null!);
  // const similarScrollRef = useRef<HTMLDivElement>(null!);

  // TMDB API configuration
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

  // Fetch movie data
  useEffect(() => {
    if (!movieId || !TMDB_API_KEY) return;

    const fetchMovieData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          movieResponse,
          creditsResponse,
          videosResponse,
          imagesResponse,
          similarResponse,
          watchProvidersResponse,
          reviewsResponse,
        ] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`),
          fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
          ),
          fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
          ),
          fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/images?api_key=${TMDB_API_KEY}`
          ),
          fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
          ),
          fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
          ),
          fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}`
          ),
        ]);

        if (!movieResponse.ok) {
          throw new Error("Movie not found");
        }

        const [
          movieData,
          creditsData,
          videosData,
          imagesData,
          similarData,
          watchProvidersData,
          reviewsData,
        ] = await Promise.all([
          movieResponse.json(),
          creditsResponse.json(),
          videosResponse.json(),
          imagesResponse.json(),
          similarResponse.json(),
          watchProvidersResponse.json(),
          reviewsResponse.json(),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData);
        setImages(imagesData);
        setSimilarMovies(similarData);
        setWatchProviders(watchProvidersData);
        setReviews(reviewsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch movie data"
        );
        console.error("Error fetching movie data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId, TMDB_API_KEY]);

  const getImageUrl = (
    path: string | null,
    size: string = "original"
  ): string => {
    return path
      ? `${TMDB_IMAGE_BASE_URL}/${size}${path}`
      : "/placeholder-image.jpg";
  };

  const getAgeRating = (): string => {
    // This would typically come from release dates API, using placeholder for now
    return "PG-13";
  };

  const getTrailerKey = (): string | null => {
    if (!videos?.results) return null;

    // Look for official trailer first
    const trailer = videos.results.find(
      (video) =>
        video.type === "Trailer" &&
        video.site === "YouTube" &&
        video.official === true
    );

    // If no official trailer, look for any trailer
    if (!trailer) {
      const anyTrailer = videos.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      return anyTrailer?.key || null;
    }

    return trailer.key;
  };

  const scroll = (
    ref: React.RefObject<HTMLDivElement>,
    direction: "left" | "right"
  ): void => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Automatically show trailer button after a delay when switching to media tab
  useEffect(() => {
    if (activeTab === "media" && !isPlaying) {
      setShowTrailerButton(false);
      const timer = setTimeout(() => setShowTrailerButton(true), 1200);
      setTrailerTimer(timer);
      return () => clearTimeout(timer);
    }
    // Reset trailer button state when leaving media tab or playing
    if (activeTab !== "media" || isPlaying) {
      setShowTrailerButton(true);
      if (trailerTimer) {
        clearTimeout(trailerTimer);
        setTrailerTimer(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isPlaying]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Movie Not Found
          </h1>
          <p className="text-muted-foreground">
            {error || "The requested movie could not be found."}
          </p>
        </div>
      </div>
    );
  }

  // Find director from credits
  const director =
    credits?.crew?.find((person) => person.job === "Director") || null;

  // Extract main cast (first 12 cast members or fewer if not available)
  const mainCast = credits?.cast?.slice(0, 12) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            width={1920}
            height={1080}
            src={getImageUrl(movie.backdrop_path, "w1280")}
            alt={movie.title}
            className="w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-xl text-white/80 mb-4 italic">
                  &quot;{movie.tagline}&quot;
                </p>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl text-white/90">
                  {new Date(movie.release_date).getFullYear()}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white/90 font-semibold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-white/60 text-sm">
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm backdrop-blur-sm">
                  {getAgeRating()}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm backdrop-blur-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-8">
                {getTrailerKey() && (
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                    {isPlaying ? "Pause Trailer" : "Play Trailer"}
                  </button>
                )}

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-4 rounded-lg backdrop-blur-sm transition-colors ${
                    isBookmarked
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Bookmark className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-4 rounded-lg backdrop-blur-sm transition-colors ${
                    isLiked
                      ? "bg-red-500 text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`}
                  />
                </button>

                <button className="p-4 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex gap-8 mb-8 border-b">
          {[
            { id: "overview" as const, label: "Overview" },
            { id: "cast" as const, label: "Cast & Crew" },
            { id: "media" as const, label: "Photos & Videos" },
            { id: "reviews" as const, label: "Reviews" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Movie Info */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {movie.overview}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Runtime</p>
                    <p className="font-semibold">
                      {formatRuntime(movie.runtime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Release</p>
                    <p className="font-semibold">
                      {formatDate(movie.release_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Language</p>
                    <p className="font-semibold">
                      {movie.spoken_languages[0]?.english_name || "English"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">{movie.status}</p>
                  </div>
                </div>
              </div>

              {/* Director */}
              {director && (
                <div>
                  <h3 className="text-xl font-bold mb-2">Director</h3>
                  <p className="text-muted-foreground">{director.name}</p>
                </div>
              )}

              {/* Box Office Stats */}
              {(movie.budget > 0 || movie.revenue > 0) && (
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Box Office</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {movie.budget > 0 && (
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Budget
                          </p>
                          <p className="font-bold text-lg">
                            {formatCurrency(movie.budget)}
                          </p>
                        </div>
                      </div>
                    )}

                    {movie.revenue > 0 && (
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Revenue
                          </p>
                          <p className="font-bold text-lg">
                            {formatCurrency(movie.revenue)}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Popularity
                        </p>
                        <p className="font-bold text-lg">
                          {Math.round(movie.popularity)}%
                        </p>
                        <div className="w-full bg-muted rounded-full h-2 mt-1">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(movie.popularity, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {/* Watch Providers */}
              {watchProviders?.results?.US && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Where to Watch</h3>
                  <div className="space-y-3">
                    {watchProviders.results.US.flatrate
                      ?.slice(0, 4)
                      .map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-primary/10 border-primary/20 text-primary"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              height={200}
                              width={200}
                              src={getImageUrl(provider.logo_path, "w92")}
                              alt={provider.provider_name}
                              className="w-8 h-8 rounded"
                            />
                            <span className="font-medium">
                              {provider.provider_name}
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* User Rating */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Rate This Movie</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setUserRating(rating)}
                      className={`p-2 transition-colors ${
                        userRating >= rating
                          ? "text-yellow-400"
                          : "text-muted-foreground hover:text-yellow-400"
                      }`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          userRating >= rating ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <p className="text-sm text-muted-foreground">
                    You rated this {userRating} out of 5 stars
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cast Tab */}
        {activeTab === "cast" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Cast & Crew</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll(castScrollRef, "left")}
                  className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll(castScrollRef, "right")}
                  className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              ref={castScrollRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {mainCast.map((person) => (
                <div
                  key={person.id}
                  className="flex-shrink-0 w-40 text-center group cursor-pointer"
                >
                  <div className="relative mb-3 overflow-hidden rounded-lg">
                    <Image
                      width={200}
                      height={200}
                      src={getImageUrl(person.profile_path, "w185")}
                      alt={person.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {person.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Tab - FIXED TRAILER SECTION */}
        {activeTab === "media" && (
          <div className="space-y-8">
            {/* Trailer Section */}
            {getTrailerKey() ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getTrailerKey()}?autoplay=1&mute=0`}
                      className="w-full h-full"
                      title={`${movie.title} Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        width={1280}
                        height={720}
                        src={getImageUrl(movie.backdrop_path, "w1280")}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      {showTrailerButton && (
                        <button
                          onClick={() => {
                            if (trailerTimer) {
                              clearTimeout(trailerTimer);
                              setTrailerTimer(null);
                            }
                            setIsPlaying(true);
                            setShowTrailerButton(false);
                          }}
                          className="absolute flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Play className="w-6 h-6" />
                          Play Trailer
                        </button>
                      )}
                      {!showTrailerButton && !isPlaying && (
                        <div className="absolute flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Starting in a few seconds...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No trailer available
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery */}
            {images && images.backdrops.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.backdrops.slice(0, 6).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        height={200}
                        width={200}
                        src={getImageUrl(image.file_path, "w780")}
                        alt={`${movie.title} ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Reviews</h2>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Write Review
              </button>
            </div>

            <div className="space-y-6">
              {reviews?.results.slice(0, 5).map((review) => (
                <div key={review.id} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {review.author[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold">{review.author}</h4>
                        <div className="flex items-center gap-2">
                          {review.author_details.rating && (
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.author_details.rating! / 2
                                      ? "text-yellow-400 fill-current"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {review.content.length > 300
                      ? `${review.content.substring(0, 300)}...`
                      : review.content}
                    {review.content.length > 300 && (
                      <button className="text-primary hover:underline ml-2">
                        Read more
                      </button>
                    )}
                  </p>
                </div>
              ))}

              {(!reviews?.results || reviews.results.length === 0) && (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to review this movie!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similarMovies && similarMovies.results.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Similar Movies</h2>
            </div>

            <Carousel>
              {similarMovies.results.slice(0, 10).map((similarMovie) => (
                <Link
                  href={`/movie/${similarMovie.id}`}
                  key={similarMovie.id}
                  className="flex-shrink-0 w-48 group cursor-pointer"
                >
                  <div className="relative mb-3 overflow-hidden rounded-lg">
                    <Image
                      width={200}
                      height={300}
                      src={getImageUrl(similarMovie.poster_path, "w342")}
                      alt={similarMovie.title}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 text-white text-sm rounded">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      {similarMovie.vote_average.toFixed(1)}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {similarMovie.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(similarMovie.release_date).getFullYear()}
                  </p>
                </Link>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
