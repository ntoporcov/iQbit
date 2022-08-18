const express = require("express");
const app = express(); // create express app
const { createProxyMiddleware } = require("http-proxy-middleware");

app.use(express.static("../release/public"));

app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.QBIT_HOST || 'http://localhost:8080',
    changeOrigin: true,
    headers: {
      referer: process.env.QBIT_HOST || 'http://localhost:8080',
    },
  })
);

app.listen(parseInt(process.env.STANDALONE_SERVER_PORT || '8081'), () => {
  console.log(`server started on port ${process.env.STANDALONE_SERVER_PORT || '8081'}`);
});
