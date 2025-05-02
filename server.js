const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/", createProxyMiddleware({
  target: "https://animixplay.st", // change this to your target site
  changeOrigin: true,
  pathRewrite: { "^/": "/" }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Proxy server running on port ${PORT});
});
