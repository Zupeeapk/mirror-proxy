const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { Buffer } = require("buffer");

const app = express();

app.use("/", createProxyMiddleware({
  target: "https://animixplay.st",
  changeOrigin: true,
  selfHandleResponse: true,
  onProxyRes: async (proxyRes, req, res) => {
    let body = Buffer.from([]);

    proxyRes.on("data", chunk => {
      body = Buffer.concat([body, chunk]);
    });

    proxyRes.on("end", () => {
      const contentType = proxyRes.headers['content-type'];

      if (contentType && contentType.includes("text/html")) {
        let html = body.toString("utf8");

        // Rewrite links to use proxy paths
        html = html.replace(/href="https:\/\/animixplay\.st\//g, 'href="/');
        html = html.replace(/src="https:\/\/animixplay\.st\//g, 'src="/');

        res.setHeader("content-type", "text/html");
        res.end(html);
      } else {
        res.end(body);
      }
    });
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
