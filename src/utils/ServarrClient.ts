import axios from "axios";

export const pushToServarr = async (
    integration: "Sonarr" | "Radarr",
    title: string,
    magnetUrl: string
) => {
    const urlStoreKey = integration === "Sonarr" ? "iqbit-sonarr-url" : "iqbit-radarr-url";
    const apiKeyStoreKey = integration === "Sonarr" ? "iqbit-sonarr-apikey" : "iqbit-radarr-apikey";

    let baseUrl = localStorage.getItem(urlStoreKey);
    const apiKey = localStorage.getItem(apiKeyStoreKey);

    if (!baseUrl) {
        baseUrl = ""
    } else {
        baseUrl = JSON.parse(baseUrl)
    }

    if (!apiKey) {
        throw new Error(`${integration} API Key is not configured`);
    }

    const parsedApiKey = JSON.parse(apiKey);

    if (!baseUrl || !parsedApiKey) {
        throw new Error(`${integration} URL or API Key is not configured`);
    }

    // Remove trailing slash if it exists
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");

    const payload = {
        title: title,
        downloadUrl: magnetUrl,
        protocol: "torrent",
        publishDate: new Date().toISOString(),
    };

    const response = await axios.post(`${cleanBaseUrl}/api/v3/release/push`, payload, {
        headers: {
            "X-Api-Key": parsedApiKey,
            "Content-Type": "application/json",
        },
    });

    return response.data;
};
