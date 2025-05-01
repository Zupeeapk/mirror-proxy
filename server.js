const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { Buffer } = require("buffer");

const app = express();
const target = "https://animixplay.st";

app.use("/", createProxyMiddleware({
  target,
  changeOrigin: true,
  selfHandleResponse: true,
  onProxyRes: async (proxyRes, req, res) => {
    let body = Buffer.from([]);

    proxyRes.on("data
