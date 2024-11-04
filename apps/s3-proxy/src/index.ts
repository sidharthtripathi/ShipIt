import express from "express";
import axios from "axios";
import mime from 'mime-types'
import dotenv from 'dotenv'
dotenv.config()
const server = express();
const baseurl = process.env.BASE_URL
server.use(async (req, res) => {
  const subDomain = req.hostname.split(".").at(0);
  const path = req.url;
  if (path === "/") {
    const response = await axios.get(
      `${baseurl}/${subDomain}/index.html`,
      { responseType: "stream" }
    );
    res.setHeader("Content-Type", "text/html");
    response.data.pipe(res);
  } else {
    const response = await axios.get(
      `${baseurl}/${subDomain}${path}`,
      { responseType: "stream" }
    );
    res.setHeader("Content-Type", mime.lookup(path) as string);
    response.data.pipe(res);
  }
});
const port = process.env.PORT || 4000
server.listen(port);

