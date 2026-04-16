import axios from "axios";
import { YTSData } from "../types";
import { videoQualities } from "../components/Filters";

// Fallback list of YTS mirrors used if the remote config cannot be fetched.
const FALLBACK_MIRRORS = [
  "https://yts.bz/api/v2/",
  "https://yts.lt/api/v2/",
];

const CACHE_KEY = "iqbit-yts-working-mirror";

/** Load the mirror list from local config only. */
async function loadMirrors(): Promise<string[]> {
  const sanitizeMirrors = (mirrors: string[]) =>
    Array.from(
      new Set(
        mirrors
          .map((mirror) => mirror.trim())
          .filter(Boolean)
          .map((mirror) => (mirror.endsWith("/") ? mirror : `${mirror}/`))
      )
    );

  return sanitizeMirrors(FALLBACK_MIRRORS);
}

/** Build a mirror list that tries the cached working mirror first. */
function prioritizeCached(mirrors: string[]): string[] {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached && mirrors.includes(cached)) {
    return [cached, ...mirrors.filter((mirror) => mirror !== cached)];
  }
  return mirrors;
}

export type ytsSearchParams = {
  query_term: string;
  limit?: number;
  page?: number;
  quality?: videoQualities;
  minimum_rating?: number;
  genre?:
  | "Action"
  | "Adventure"
  | "Animation"
  | "Biography"
  | "Comedy"
  | "Crime"
  | "Documentary"
  | "Drama"
  | "Family"
  | "Fantasy"
  | "Film Noir"
  | "History"
  | "Horror"
  | "Music"
  | "Musical"
  | "Mystery"
  | "Romance"
  | "Sci-Fi"
  | "Short Film"
  | "Sport"
  | "Superhero"
  | "Thriller"
  | "War"
  | "Western";
  sort_by?:
  | "title"
  | "year"
  | "rating"
  | "peers"
  | "seeds"
  | "download_count"
  | "like_count"
  | "date_added";
  order_by?: "desc" | "asc";
  // with_rt_ratings?: boolean;
};

export const YTSClient = {
  search: async ({
    query_term,
    limit,
    page,
    quality,
    minimum_rating,
    genre,
    sort_by,
    order_by,
  }: ytsSearchParams): Promise<YTSData> => {
    let lastError: any;

    // Load mirrors from local config, then try the last known working mirror first.
    const mirrors = prioritizeCached(await loadMirrors());

    for (const baseURL of mirrors) {
      try {
        const { data } = await axios.get(`${baseURL}list_movies.json`, {
          params: {
            limit, // Integer between 1 - 50 (inclusive)
            page, // Integer (Unsigned)
            quality, // String (720p, 1080p, 2160p, 3D)
            minimum_rating, // Integer between 0 - 9 (inclusive)
            query_term, // String
            genre, // String from http://www.imdb.com/genre/
            sort_by, // String (title, year, rating, peers, seeds, download_count, like_count, date_added)
            order_by,
            with_rt_ratings: true, // Bool
          },
          // Timeout after 3 seconds to fail fast and try the next mirror
          timeout: 3000,
        });

        // YTS returns `movie_count: 0` without a `movies` array for empty results.
        if (data?.data) {
          localStorage.setItem(CACHE_KEY, baseURL);
          return data.data;
        }
      } catch (error) {
        // If this mirror fails, log it (optional) and loop to the next one
        console.warn(`YTS mirror failed: ${baseURL}`, error);
        lastError = error;
      }
    }

    // If the loop finishes and no mirror worked, clear the cache and throw
    localStorage.removeItem(CACHE_KEY);
    throw lastError || new Error("All YTS mirrors failed.");
  },
};
