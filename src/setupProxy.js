const { createProxyMiddleware } = require("http-proxy-middleware");

const qbittorrentHost = "http://192.168.50.100:8080";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: qbittorrentHost,
      changeOrigin: true,
      headers: {
        referer: qbittorrentHost,
        origin: qbittorrentHost,
      },
    })
  );
};
