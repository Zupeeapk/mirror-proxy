const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const target = "https://animixplay.st";

app.use("/", createProxyMiddleware({
  target,
  changeOrigin: true,
  selfHandleResponse: false,

  // Remove compression to allow future HTML rewriting (if needed)
  onProxyReq: (proxyReq) => {
    proxyReq.removeHeader("accept-encoding");
  },

  // Rewrites redirect responses (Location header)
  onProxyRes: (proxyRes, req, res) => {
    const locationHeader = proxyRes.headers["location"];
    if (locationHeader && locationHeader.startsWith(target)) {
      proxyRes.headers["location"] = locationHeader.replace(
        target,
        `${req.protocol}://${req.get("host")}`
      );
    }
  },

  pathRewrite: { "^/": "/" }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
