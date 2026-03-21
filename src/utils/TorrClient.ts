import axios from "axios";
import {
  TorrCategories,
  TorrMainData,
  TorrPlugin,
  TorrPluginSearchResultResponse,
  TorrSettings,
  TorrTorrentInfo,
} from "../types";

let serverAddress = new URL(".", window.location.href).href;

if (serverAddress.substring(serverAddress.length - 1) !== "/") {
  serverAddress = `${serverAddress}/`;
}

const baseURL = `${serverAddress}api/v2/`;

const APICall = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// --- INTERCEPTOR AÑADIDO PARA SOLUCIONAR EL BUCLE AL CADUCAR LA SESIÓN ---
APICall.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el servidor devuelve error 403 (Prohibido/Sesión caducada) y no hemos reintentado ya
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Intentar recuperar las credenciales guardadas
      const credsStr = window.localStorage.getItem("iqbit_creds");
      if (credsStr) {
        try {
          const creds = JSON.parse(credsStr); // useLocalStorage guarda como JSON
          if (creds.username && creds.password) {
            
            // Intentar re-autenticarse en segundo plano
            const loginRes = await TorrClient.login({ 
                username: creds.username, 
                password: creds.password 
            });
            
            if (loginRes.data === "Ok.") {
              // Si el login automático tiene éxito, reintentar la petición original que falló
              return APICall(originalRequest); 
            }
          }
        } catch (e) {
          console.error("Error reconectando:", e);
        }
      }
      
      // Si llegamos aquí es que la reconexión falló o las credenciales son inválidas.
      // Borramos las credenciales obsoletas y recargamos para mostrar la pantalla de login de nuevo.
      window.localStorage.removeItem("iqbit_creds");
      window.location.reload();
    }
    
    return Promise.reject(error);
  }
);
// --------------------------------------------------------------------------

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

  resume: async (hash = "") => {
    return await APICall.post("torrents/start", `hashes=${hash}`);
  },

  resumeAll: async () => {
    return await APICall.post("torrents/start", `hashes=all`);
  },

  pause: async (hash = "") => {
    return await APICall.post("torrents/pause", `hashes=${hash}`);
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

  updatePlugins: async () => {
    await APICall.post("search/updatePlugins");
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
};
