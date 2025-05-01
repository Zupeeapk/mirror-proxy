const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/", createProxyMiddleware({
  target: "https://animixplay.st",
  changeOrigin: true,
  selfHandleResponse: true, // Allows custom HTML response handling
  onProxyRes: async (proxyRes, req, res) => {
    let body = Buffer.from([]);

    proxyRes.on("data", chunk => {
      body = Buffer.concat([body, chunk]);
    });

    proxyRes.on("end", () => {
      const contentType = proxyRes.headers["content-type"];
      res.statusCode = proxyRes.statusCode;

      // If it's HTML, rewrite links
      if (contentType && contentType.includes("text/html")) {
        let html = body.toString("utf8");

        // Replace all absolute URLs to stay within the proxy
        const baseUrl = req.protocol + "://" + req.headers.host;
        html = html.replace(/https:\/\/animixplay\.st/g, baseUrl);

        res.setHeader("Content-Type", "text/html");
        res.end(html);
      } else {
        // If not HTML (e.g., JS/CSS), just forward the response
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        res.end(body);
      }
    });
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Mirror proxy server running on port", PORT);
});
