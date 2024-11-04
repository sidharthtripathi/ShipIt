import amqp from "amqplib";
import { exec } from "child_process";
import { createClient } from "redis";
import path from "path";
import util from "util";
import fs from "fs";
import { uploadFolder } from "./s3";
import dotenv from "dotenv";
dotenv.config();
const execPromise = util.promisify(exec);
async function main() {
  const redis = createClient({ url: process.env.REDIS_URL });
  if (!redis.isOpen) await redis.connect();
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();
  await channel.assertQueue("messages", { durable: false });
  channel.consume(
    "messages",
    async (msg) => {
      try {
        const payload = Buffer.from(msg?.content!).toString();
        console.log("Got msg: ", payload);
        const { domain, url, env } = JSON.parse(payload) as {
          domain: string;
          url: string;
          env: string;
        };
        // check if output folder exists
        const exists = fs.existsSync(path.join(__dirname, "outputs"));
        if (!exists) fs.mkdirSync(path.join(__dirname, "outputs"));
        fs.mkdirSync(path.join(__dirname, "outputs", domain));
        try {
          await execPromise(
            `docker run --name=${domain} -e GITHUB_URL=${url} react-builder:latest`
          );
        } catch (error) {
          console.error("Docker Error: ", error);
          redis.hSet(`deployments:${domain}`, {
            err: JSON.stringify(error),
            status: "failed",
          });
        }

        try {
          await execPromise(
            `docker cp ${domain}:/react-builder/repo/dist ${path.join(
              __dirname,
              "outputs",
              domain
            )}`
          );
        } catch (error) {
          console.log(error);
        }
        await uploadFolder(path.join(__dirname, "outputs", domain), domain);
        redis.hSet(`deployments:${domain}`, { status: "deployed" });
        await execPromise(`docker container prune -f && rm -r outputs/${domain}`);
      } catch (error) {
        console.log(error);
      }
    },
    {
      noAck: true,
    }
  );
}

main();
