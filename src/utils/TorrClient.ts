import axios from "axios";
import {
  TorrCategories,
  TorrMainData,
  TorrPlugin,
  TorrPluginSearchResultResponse,
  TorrSettings,
  TorrTorrentInfo,
  TorrFile,
  TorrFilePriority,
} from "../types";

let serverAddress = new URL(".", window.location.href).href

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
    let usernameEncode = encodeURIComponent(username);
    let passwordEncode = encodeURIComponent(password);
    return await APICall.post(
      "auth/login",
      `username=${usernameEncode}&password=${passwordEncode}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    );
  },

  logout: async () => {
    return await APICall.post("auth/logout");
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

  getTransferInfo: async (): Promise<TorrServerState> => {
    const { data } = await APICall.get("transfer/info");
    return data;
  },

  resume: async (hash = "") => {
    return await APICall.post("torrents/start", `hashes=${hash}`);
  },

  resumeAll: async () => {
    return await APICall.post("torrents/start", `hashes=all`);
  },

  pause: async (hash = "") => {
    return await APICall.post("torrents/stop", `hashes=${hash}`);
  },

  pauseAll: async () => {
    return await APICall.post("torrents/stop", `hashes=all`);
  },

  remove: async (hash = "", deleteFiles = true) => {
    return await APICall.post(
      "torrents/delete",
      `hashes=${hash}&deleteFiles=${deleteFiles}`
    );
  },

  addTorrent: async (
    uploadType: "urls" | "torrents",
    file: string | File,
    category = "",
    savePath = ""
  ) => {
    const formData = new FormData();
    formData.append("category", category);

    if (savePath) {
      formData.append("savepath", savePath);
    }
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
    return await APICall.post(
      "torrents/createCategory",
      `category=${name}&savePath=${path}`
    );
  },

  removeCategories: async (category: string) => {
    return await APICall.post(
      "torrents/removeCategories",
      `categories=${category}`
    );
  },

  saveCategory: async (category: string, savePath: string) => {
    return await APICall.post(
      "torrents/editCategory",
      `category=${category}&savePath=${savePath}`
    );
  },

  setTorrentCategory: async (hash = "", category = "") => {
    return await APICall.post(
      "torrents/setCategory",
      `hashes=${hash}&category=${category}`
    );
  },

  renameTorrent: async (hash: string, name: string) => {
    return await APICall.post("torrents/rename", `hash=${hash}&name=${name}`);
  },

  setAutoManagement: async (hash: string, enable: string) => {
    return await APICall.post(
      "torrents/setAutoManagement",
      `hashes=${hash}&enable=${enable}`
    );
  },

  toggleSequentialDownload: async (hash: string) => {
    return await APICall.post(
      "torrents/toggleSequentialDownload",
      `hashes=${hash}`
    );
  },

  toggleFirstLastPiecePrio: async (hash: string) => {
    return await APICall.post(
      "torrents/toggleFirstLastPiecePrio",
      `hashes=${hash}`
    );
  },

  recheck: async (hash: string) => {
    return await APICall.post("torrents/recheck", `hashes=${hash}`);
  },

  reannounce: async (hash: string) => {
    return await APICall.post("torrents/reannounce", `hashes=${hash}`);
  },

  setLocation: async (hash: string, location: string, moveFiles: boolean = true) => {
    return await APICall.post("torrents/setLocation", `hashes=${hash}&location=${location}`);
  },

  renameFile: async (hash: string, oldPath: string, newPath: string) => {
    return await APICall.post("torrents/renameFile", `hash=${hash}&oldPath=${oldPath}&newPath=${newPath}`);
  },

  setDownloadLimit: async (hash: string, limit: string) => {
    return await APICall.post("torrents/setDownloadLimit", `hashes=${hash}&limit=${limit}`);
  },

  setUploadLimit: async (hash: string, limit: string) => {
    return await APICall.post("torrents/setUploadLimit", `hashes=${hash}&limit=${limit}`);
  },

  getInstalledPlugins: async (): Promise<TorrPlugin[]> => {
    const { data } = await APICall.get("search/plugins");
    return data;
  },

  togglePluginEnabled: async (name: string, enable: boolean) => {
    const { data } = await APICall.post(
      "search/enablePlugin",
      `names=${name}&enable=${enable}`
    );
    return data;
  },

  installPlugin: async (path: string) => {
    await APICall.post("search/installPlugin", `sources=${path}`);
  },

  uninstallPlugin: async (name: string) => {
    const { data } = await APICall.post(
      "search/uninstallPlugin",
      `names=${name}`
    );
    return data;
  },

  getResults: async (id: number): Promise<TorrPluginSearchResultResponse> => {
    const { data } = await APICall.get("search/results", { params: { id } });
    return data;
  },

  stopSearch: async (id: number): Promise<TorrPluginSearchResultResponse> => {
    const { data } = await APICall.post("search/stop", `id=${id}`);
    return data;
  },

  deleteSearch: async (id: number) => {
    const { data } = await APICall.post("search/delete", `id=${id}`);
    return data;
  },

  createSearch: async (query: string): Promise<{ id: number }> => {
    const { data } = await APICall.post(
      "search/start",
      `pattern=${query}&plugins=enabled&category=all`
    );
    return data;
  },
  getTorrentContents: async (hash: string): Promise<TorrFile[]> => {
    const { data } = await APICall.get("torrents/files", {
      params: {
        hash,
      },
    });

    return data;
  },

  setFilePriority: async (hash: string, fileIndex: number, priority: TorrFilePriority) => {
    return await APICall.post(
      "torrents/filePrio",
      `hash=${hash}&id=${fileIndex}&priority=${priority}`
    );
  },

  setFilePriorities: async (hash: string, fileIndices: number[], priority: TorrFilePriority) => {
    const ids = fileIndices.join("|");
    return await APICall.post(
      "torrents/filePrio",
      `hash=${hash}&id=${ids}&priority=${priority}`
    );
  },

  setForceStart: async (hash: string, value: boolean) => {
    return await APICall.post(
      "torrents/setForceStart",
      "hashes=" + hash + "&value=" + value
    );
  },

  setSuperSeeding: async (hash: string, value: boolean) => {
    return await APICall.post(
      "torrents/setSuperSeeding",
      "hashes=" + hash + "&value=" + value
    );
  },

  exportTorrent: async (hash: string) => {
    const { data } = await APICall.get("torrents/export", {
      params: { hash },
      responseType: "blob",
    });
    return data;
  },

  getTrackers: async (hash: string) => {
    const { data } = await APICall.get("torrents/trackers", {
      params: { hash },
    });
    return data;
  },

  addTrackers: async (hash: string, urls: string) => {
    return await APICall.post(
      "torrents/addTrackers",
      `hashes=${hash}&urls=${encodeURIComponent(urls)}`
    );
  },

  editTracker: async (hash: string, origUrl: string, newUrl: string) => {
    return await APICall.post(
      "torrents/editTracker",
      `hash=${hash}&origUrl=${encodeURIComponent(origUrl)}&newUrl=${encodeURIComponent(newUrl)}`
    );
  },

  removeTrackers: async (hash: string, urls: string) => {
    return await APICall.post(
      "torrents/removeTrackers",
      `hashes=${hash}&urls=${encodeURIComponent(urls)}`
    );
  },

  getWebSeeds: async (hash: string) => {
    const { data } = await APICall.get("torrents/webseeds", {
      params: { hash },
    });
    return data;
  },

  addHttpSeeds: async (hash: string, urls: string) => {
    return await APICall.post(
      "torrents/addHttpSeeds",
      `hashes=${hash}&urls=${encodeURIComponent(urls)}`
    );
  },

  removeHttpSeeds: async (hash: string, urls: string) => {
    return await APICall.post(
      "torrents/removeHttpSeeds",
      `hashes=${hash}&urls=${encodeURIComponent(urls)}`
    );
  },
};
