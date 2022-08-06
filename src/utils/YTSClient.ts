import axios from "axios";
import {YTSData} from "../types";
import {videoQualities} from "../components/Filters";

const baseURL = `https://yts.mx/api/v2/`;

const APICall = axios.create({
  baseURL: baseURL,
});

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
    const { data } = await APICall.get("list_movies.json", {
      params: {
        limit, //Integer between 1 - 50 (inclusive)
        page, //Integer (Unsigned)
        quality, //String (720p, 1080p, 2160p, 3D)
        minimum_rating, //Integer between 0 - 9 (inclusive)
        query_term, //String
        genre, //String from http://www.imdb.com/genre/
        sort_by, //String (title, year, rating, peers, seeds, download_count, like_count, date_added)
        order_by,
        with_rt_ratings: true, //Bool
      },
    });

    return data.data;
  },
};
