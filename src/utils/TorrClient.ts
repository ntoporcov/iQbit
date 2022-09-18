import axios from "axios";
import {
  TorrCategories,
  TorrMainData,
  TorrPlugin,
  TorrPluginSearchResultResponse,
  TorrSettings,
  TorrTorrentInfo,
} from "../types";

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
  getVersion: async () => {
    return await APICall.get("/app/version");
  },

  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    return await APICall.post(
      "auth/login",
      `username=${username}&password=${password}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    );
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

  addTorrent: async (
    uploadType: "urls" | "torrents",
    file: string | File,
    category = ""
  ) => {
    const formData = new FormData();
    formData.append("category", category);
    formData.append(uploadType, file);
    const { data } = await APICall.post("torrents/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  getSettings: async (): Promise<TorrSettings> => {
    const { data } = await APICall.get("app/preferences");
    return data;
  },

  updateSettings: async (settings: TorrSettings) => {
    return await APICall.post(
      "app/setPreferences",
      `json=${JSON.stringify(settings)}`
    );
  },

  getCategories: async (): Promise<TorrCategories> => {
    const { data } = await APICall.get("torrents/categories");
    return data;
  },

  addCategory: async (name: string, path: string) => {
    return await APICall.get("torrents/createCategory", {
      params: {
        category: name,
        savePath: path,
      },
    });
  },

  // removeCategories: async (category) => {
  //   return await APICall.get("torrents/removeCategories", {
  //     params: {
  //       categories: category,
  //     },
  //   });
  // },

  saveCategory: async (category: string, savePath: string) => {
    return await APICall.get("torrents/editCategory", {
      params: {
        category,
        savePath,
      },
    });
  },

  setTorrentCategory: async (hash = "", category = "") => {
    return await APICall.get("torrents/setCategory", {
      params: {
        hashes: hash,
        category,
      },
    });
  },

  renameTorrent: async (hash: string, name: string) => {
    return await APICall.get("torrents/rename", {
      params: {
        hash,
        name,
      },
    });
  },

  getInstalledPlugins: async (): Promise<TorrPlugin[]> => {
    const { data } = await APICall.get("search/plugins");
    return data;
  },

  togglePluginEnabled: async (name: string, enable: boolean) => {
    const { data } = await APICall.get("search/enablePlugin", {
      params: { names: name, enable },
    });
    return data;
  },

  installPlugin: async (path: string) => {
    await APICall.post("search/installPlugin", `sources=${path}`);
  },

  uninstallPlugin: async (name: string) => {
    const { data } = await APICall.get("search/uninstallPlugin", {
      params: { names: name },
    });
    return data;
  },

  getResults: async (id: number): Promise<TorrPluginSearchResultResponse> => {
    const { data } = await APICall.get("search/results", { params: { id } });
    return data;
  },

  stopSearch: async (id: number): Promise<TorrPluginSearchResultResponse> => {
    const { data } = await APICall.get("search/stop", { params: { id } });
    return data;
  },

  deleteSearch: async (id: number) => {
    const { data } = await APICall.get("search/delete", { params: { id } });
    return data;
  },

  createSearch: async (query: string): Promise<{ id: number }> => {
    const { data } = await APICall.get("search/start", {
      params: {
        pattern: query,
        plugins: "enabled",
        category: "all",
      },
    });
    return data;
  },
};
