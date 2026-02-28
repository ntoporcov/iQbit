import axios from "axios";
import { YTSData } from "../types";
import { videoQualities } from "../components/Filters";

// Fallback list of YTS mirrors used if the remote config cannot be fetched.
const FALLBACK_MIRRORS = [
  "https://yts.bz/api/v2/",
  "https://yts.lt/api/v2/",
  "https://yts.am/api/v2/",
  "https://yts.ag/api/v2/",
];

// Remote mirror list hosted in the repo — update this file on GitHub to fix
// broken mirrors for all users without any code change or rebuild needed.
const REMOTE_MIRRORS_URL =
  "https://raw.githubusercontent.com/Indi733/iQbit/main/public/yts-mirrors.json";

const CACHE_KEY = "iqbit-yts-working-mirror";

/** Load the mirror list: tries remote JSON first, falls back to hardcoded list. */
async function loadMirrors(): Promise<string[]> {
  try {
    const { data } = await axios.get(REMOTE_MIRRORS_URL, { timeout: 3000 });
    if (Array.isArray(data?.mirrors) && data.mirrors.length > 0) {
      return data.mirrors as string[];
    }
  } catch {
    // Remote fetch failed — use hardcoded fallback silently
  }
  return FALLBACK_MIRRORS;
}

/** Build a mirror list that tries the cached working mirror first. */
function prioritizeCached(mirrors: string[]): string[] {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached && mirrors.includes(cached)) {
    return [cached, ...mirrors.filter((m) => m !== cached)];
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

    // Load mirrors: tries remote JSON first, falls back to hardcoded list.
    // Then re-orders so the last known working mirror is tried first.
    const mirrors = prioritizeCached(await loadMirrors());

    for (const baseURL of mirrors) {
      try {
        const { data } = await axios.get(`${baseURL}list_movies.json`, {
          params: {
            limit,
            page,
            quality,
            minimum_rating,
            query_term,
            genre,
            sort_by,
            order_by,
            with_rt_ratings: true,
          },
          // Timeout after 3 seconds to fail fast and try the next mirror
          timeout: 3000,
        });

        // If request is successful and contains data, cache the mirror and return
        if (data && data.data) {
          localStorage.setItem(CACHE_KEY, baseURL);
          return data.data;
        }
      } catch (error) {
        console.warn(`YTS mirror failed: ${baseURL}`, error);
        lastError = error;
      }
    }

    // If the loop finishes and no mirror worked, clear the cache and throw
    localStorage.removeItem(CACHE_KEY);
    throw lastError || new Error("All YTS mirrors failed.");
  },
};
