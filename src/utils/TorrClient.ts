import axios from "axios";

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

  getTorrents: async (sortKey = "added_on", reverse = true) => {
    return await APICall.get("torrents/info", {
      params: {
        sort: sortKey,
        reverse,
      },
    });
  },

  // getProperties: async (hash) => {
  //   return await APICall.get("torrents/properties", {
  //     params: {
  //       hashes: hash,
  //     },
  //   });
  // },

  sync: async (rid: number) => {
    return await APICall.get("sync/maindata", {
      params: {
        rid,
      },
    });
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

  remove: async (hash = "", deleteFiles = false) => {
    return await APICall.get("torrents/delete", {
      params: {
        hashes: hash,
        deleteFiles,
      },
    });
  },

  addTorrent: async (url = "") => {
    return await APICall.get("torrents/add", {
      params: {
        urls: url,
      },
    });
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

  getCategories: async () => {
    return await APICall.get("torrents/categories");
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
