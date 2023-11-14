const { createProxyMiddleware } = require("http-proxy-middleware");

const qbittorrentHost = "http://cafofotoporcov.asuscomm.com";

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
