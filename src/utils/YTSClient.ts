import axios from "axios";
import { YTSData } from "../types";
import { videoQualities } from "../components/Filters";

// List of YTS mirrors to try in priority order.
// If the official (yts.mx) fails, it will automatically try the others.
const MIRRORS = [
  "https://yts.mx/api/v2/",
  "https://yts.am/api/v2/",
  "https://yts.ag/api/v2/",
  "https://yts.lt/api/v2/",
  "https://yts.pm/api/v2/",
];

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

    // Iterate through all mirrors until one returns a successful response
    for (const baseURL of MIRRORS) {
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

        // If request is successful and contains data, return it
        if (data && data.data) {
          return data.data;
        }
      } catch (error) {
        // If this mirror fails, log it (optional) and loop to the next one
        console.warn(`YTS mirror failed: ${baseURL}`, error);
        lastError = error;
      }
    }

    // If the loop finishes and no mirror worked, throw the last error
    throw lastError || new Error("All YTS mirrors failed.");
  },
};
