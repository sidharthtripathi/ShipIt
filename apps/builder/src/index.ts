import amqp from "amqplib";
import { spawn, exec } from "child_process";
import { createClient } from "redis";
import { QueueDeploymentMessageSchema } from "schema";
import { z } from "zod";
import path from "path";
import util from "util";
import fs from "fs";
import { uploadFolder } from "./s3";
import dotenv from "dotenv";
const execPromise = util.promisify(exec);
dotenv.config();
type MessageType = z.infer<typeof QueueDeploymentMessageSchema>;
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
        const payload = msg?.content.toString() as string;
        console.log("Got msg: ", payload);
        const { domain, url, envs, outputDir, buildCmd, installCmd } =
          JSON.parse(payload) as MessageType;
        let envsString = ``;
        for (let i = 0; i < envs.length; i++) {
          const key = envs[i].key;
          const value = envs[i].value;
          envsString.concat(`-e ${key}=${value}`).concat(" "); // gotcha point here
        }
        // check if output folder exists
        const exists = fs.existsSync(path.join(__dirname, "outputs"));
        if (!exists) fs.mkdirSync(path.join(__dirname, "outputs"));
        fs.mkdirSync(path.join(__dirname, "outputs", domain));
        await redis.xAdd(`logs:${domain}`, "*", {
          log: "starting build process",
          type: "log",
        });
        const dockerBuildChild = spawn("docker", [
          "run",
          `--name=${domain}`,
          "-e",
          `GITHUB_URL=${url}`,
          "-e",
          `BUILD_CMD=${buildCmd}`,
          "-e",
          `INSTALL_CMD=${installCmd}`,
          "react-builder:latest",
        ]);
        dockerBuildChild.stdout.on("data", async (data) => {
          await redis.xAdd(`logs:${domain}`, "*", {
            log: data.toString(),
            type: "log",
          });
        });
        dockerBuildChild.stderr.on("data", async (data) => {
          await redis.xAdd(`logs:${domain}`, "*", {
            log: data.toString(),
            type: "error",
          });
          await redis.hSet(`deployments:${domain}`, {
            status: "failed",
          });
        });

        dockerBuildChild.on("close", async() => {
          await redis.xAdd(`logs:${domain}`, "*", {
            log: "done with build process",
            type: "log",
          });
          const dockerCopyChild = spawn("docker", [
            "cp",
            `${domain}:/react-builder/repo/${outputDir}`,
            `${path.join(__dirname, "outputs", domain)}`,
          ]);
          dockerCopyChild.stderr.on("data", async (data) => {
            await redis.xAdd(`logs:${domain}`, "*", {
              log: data.toString(),
              type: "error",
            });
            await redis.hSet(`deployments:${domain}`, {
              status: "failed",
            });
          });
          dockerCopyChild.on("close", async () => {
            await redis.xAdd(`logs:${domain}`, "*", {
              log: "uploading build",
              type: "log",
            });
            await uploadFolder(
              path.join(__dirname, "outputs", domain, outputDir),
              domain
            );
            
            await redis.xAdd(`logs:${domain}`, "*", {
                log: "Deployed",
                type: "log",
            });
            await redis.hSet(`deployments:${domain}`, {
              status: "deployed",
            });
            await execPromise(
              `docker container prune -f && rm -r ${path.join(
                __dirname,
                "outputs",
              )}`
            );
          });
        });
      } catch (error) {
        console.error(error);
      }
    },
    {
      noAck: true,
    }
  );
}

main();
