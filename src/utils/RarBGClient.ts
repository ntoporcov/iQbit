import axios from "axios";
import { rarbgTorrent } from "../types";

const devURL = "http://localhost:5005/";
const useLocalServer = false;

const ApiDomain =
  process.env.NODE_ENV === "development" && useLocalServer
    ? devURL
    : "https://iqbit.app/";

const app_id = "iqbit";

export const RarbgCategoryDictionary = {
  Movies: "movies",
  TV: "2;18;41;49",
  Porn: "2;4",
  Games: "2;27;28;29;30;31;53",
  Music: "2;23;24;25;26",
  Software: "2;33;34;43",
};

const api = axios.create({
  baseURL: `${ApiDomain}api/rarbg/`,
  params: { token: "", app_id },
});

const getToken = async () =>
  axios.get<{ token: string }>(`${ApiDomain}api/rarbg/getToken`);

api.interceptors.request.use(
  async (config) => {
    if (!config.params?.token) {
      const { data } = await getToken();
      api.defaults.params.token = data.token;
      config.params.token = data.token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(async (response) => {
  if (response.data.error_code === 4) {
    const { data } = await getToken();
    api.defaults.params.token = data.token;
  }

  // if (response.data.rate_limit) {
  //   setTimeout(() => {
  //     return api(response.config);
  //   }, 1000);
  // }

  return response;
});

export const rarbgAPI = {
  search: async (
    query: string,
    category: keyof typeof RarbgCategoryDictionary
  ): Promise<{
    torrent_results: rarbgTorrent[];
    error_code?: number;
    rate_limit?: number;
  }> => {
    const { data } = await api.get<{ torrent_results: rarbgTorrent[] }>(
      "search",
      {
        params: {
          query,
          category: RarbgCategoryDictionary[category],
        },
      }
    );

    return data;
  },
};
