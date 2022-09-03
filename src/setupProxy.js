const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      headers: {
        referer: 'http://localhost:8080',
        origin: 'http://localhost:8080',
      },
    })
  );
};