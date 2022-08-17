const express = require("express");
const app = express(); // create express app
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

app.use(express.static("../release/public"));

app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.QBIT_HOST,
    changeOrigin: true,
    headers: {
      referer: process.env.QBIT_HOST,
    },
  })
);

app.listen(parseInt(process.env.STANDALONE_SERVER_PORT), () => {
  console.log(`server started on port ${process.env.STANDALONE_SERVER_PORT}`);
});
