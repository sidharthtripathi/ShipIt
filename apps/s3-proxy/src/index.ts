import express from "express";

import dotenv from "dotenv";

import httpProxy from "http-proxy";
dotenv.config();
const server = express();
const BASE_PATH = process.env.BASE_URL;

const app = express();
const PORT = 4000;

const proxy = httpProxy.createProxy();

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];

  // Custom Domain - DB Query

  const resolvesTo = `${BASE_PATH}/${subdomain}`;

  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;
  if (url === "/") proxyReq.path += "index.html";
});

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`));
