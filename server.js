const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/", createProxyMiddleware({
  target: "https://animixplay.st",
  changeOrigin: true,
  selfHandleResponse: false,
  followRedirects: true,
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://animixplay.st"
  },
  onProxyRes: (proxyRes, req, res) => {
    // Remove or replace redirect headers to stay inside the proxy
    const locationHeader = proxyRes.headers['location'];
    if (locationHeader && locationHeader.startsWith('https://animixplay.st')) {
      proxyRes.headers['location'] = locationHeader.replace(
        'https://animixplay.st',
        req.protocol + '://' + req.get('host')
      );
    }
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
