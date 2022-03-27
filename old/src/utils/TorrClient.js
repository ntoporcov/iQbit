import axios from "axios";

let serverAddress = window.location.origin;

if (serverAddress.substring(serverAddress.length - 1) !== "/") {
  serverAddress = `${serverAddress}/`;
}

console.log(serverAddress);

const baseURL = `${serverAddress}api/v2/`;

const APICall = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

const nakedCall = axios.create({
  baseURL: baseURL,
});

export const login = async ({ username, password }) => {
  return await nakedCall.get("auth/login", {
    params: { username, password },
  });
};

export const logout = async () => {
  return await nakedCall.get("auth/logout");
};

export const getTorrents = async (sortKey = "added_on", reverse = true) => {
  return await APICall.get("torrents/info", {
    params: {
      sort: sortKey,
      reverse,
    },
  });
};

export const getProperties = async (hash) => {
  return await APICall.get("torrents/properties", {
    params: {
      hashes: hash,
    },
  });
};

export const sync = async (rid) => {
  return await APICall.get("sync/maindata", {
    params: {
      rid,
    },
  });
};

export const resume = async (hash = "") => {
  return await APICall.get("torrents/resume", {
    params: {
      hashes: hash,
    },
  });
};

export const resumeAll = async () => {
  return await APICall.get("torrents/resume", {
    params: {
      hashes: "all",
    },
  });
};

export const pause = async (hash = "") => {
  return await APICall.get("torrents/pause", {
    params: {
      hashes: hash,
    },
  });
};

export const pauseAll = async () => {
  return await APICall.get("torrents/pause", {
    params: {
      hashes: "all",
    },
  });
};

export const remove = async (hash = "", deleteFiles = false) => {
  return await APICall.get("torrents/delete", {
    params: {
      hashes: hash,
      deleteFiles,
    },
  });
};

export const addTorrent = async (url = "") => {
  return await APICall.get("torrents/add", {
    params: {
      urls: url,
    },
  });
};

export const getPrefs = async () => {
  return await APICall.get("app/preferences");
};

export const updatePref = async (json = {}) => {
  return await APICall.get("app/setPreferences", {
    params: {
      json,
    },
  });
};

export const getCategories = async () => {
  return await APICall.get("torrents/categories");
};

export const addCategory = async (name, path) => {
  return await APICall.get("torrents/createCategory", {
    params: {
      category: name,
      savePath: path,
    },
  });
};

export const removeCategories = async (category) => {
  return await APICall.get("torrents/removeCategories", {
    params: {
      categories: category,
    },
  });
};

export const editCategory = async (category, path) => {
  return await APICall.get("torrents/editCategory", {
    params: {
      category,
      path,
    },
  });
};

export const setTorrentCategory = async (hash = "", category = "") => {
  return await APICall.get("torrents/setCategory", {
    params: {
      hashes: hash,
      category,
    },
  });
};
