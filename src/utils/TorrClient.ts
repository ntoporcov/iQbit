import axios from "axios";
import { TorrCategories, TorrMainData, TorrTorrentInfo } from "../types";

let serverAddress = window.location.origin;

if (serverAddress.substring(serverAddress.length - 1) !== "/") {
  serverAddress = `${serverAddress}/`;
}

const baseURL = `${serverAddress}api/v2/`;

const APICall = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const TorrClient = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    return await APICall.get("auth/login", {
      params: { username, password },
    });
  },

  logout: async () => {
    return await APICall.get("auth/logout");
  },

  getTorrents: async (
    sortKey = "added_on",
    reverse = true
  ): Promise<TorrTorrentInfo[]> => {
    const { data } = await APICall.get("torrents/info", {
      params: {
        sort: sortKey,
        reverse,
      },
    });

    return data;
  },

  // getProperties: async (hash) => {
  //   return await APICall.get("torrents/properties", {
  //     params: {
  //       hashes: hash,
  //     },
  //   });
  // },

  sync: async (rid: number): Promise<TorrMainData> => {
    const { data } = await APICall.get("sync/maindata", {
      params: {
        rid,
      },
    });

    return data;
  },

  resume: async (hash = "") => {
    return await APICall.get("torrents/resume", {
      params: {
        hashes: hash,
      },
    });
  },

  resumeAll: async () => {
    return await APICall.get("torrents/resume", {
      params: {
        hashes: "all",
      },
    });
  },

  pause: async (hash = "") => {
    return await APICall.get("torrents/pause", {
      params: {
        hashes: hash,
      },
    });
  },

  pauseAll: async () => {
    return await APICall.get("torrents/pause", {
      params: {
        hashes: "all",
      },
    });
  },

  remove: async (hash = "", deleteFiles = true) => {
    return await APICall.get("torrents/delete", {
      params: {
        hashes: hash,
        deleteFiles,
      },
    });
  },

  addTorrent: async (uploadType: "urls" | "torrents", file: string | File) => {
    const formData = new FormData();
    formData.append(uploadType, file);
    const { data } = await APICall.post("torrents/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  getPrefs: async () => {
    return await APICall.get("app/preferences");
  },

  updatePref: async (json = {}) => {
    return await APICall.get("app/setPreferences", {
      params: {
        json,
      },
    });
  },

  getCategories: async (): Promise<TorrCategories> => {
    const { data } = await APICall.get("torrents/categories");
    return data;
  },

  // addCategory: async (name, path) => {
  //   return await APICall.get("torrents/createCategory", {
  //     params: {
  //       category: name,
  //       savePath: path,
  //     },
  //   });
  // },

  // removeCategories: async (category) => {
  //   return await APICall.get("torrents/removeCategories", {
  //     params: {
  //       categories: category,
  //     },
  //   });
  // },
  //
  // editCategory: async (category, path) => {
  //   return await APICall.get("torrents/editCategory", {
  //     params: {
  //       category,
  //       path,
  //     },
  //   });
  // },

  setTorrentCategory: async (hash = "", category = "") => {
    return await APICall.get("torrents/setCategory", {
      params: {
        hashes: hash,
        category,
      },
    });
  },
};
