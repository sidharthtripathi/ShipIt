import amqp from "amqplib";
import { exec } from "child_process";
import { createClient } from "redis";
import {QueueDeploymentMessageSchema} from 'schema'
import {z} from 'zod'
import path from "path";
import util from "util";
import fs from "fs";
import { uploadFolder } from "./s3";
import dotenv from "dotenv";
dotenv.config();
const backendURL = new URL(process.env.BACKEND_URL!);
type MessageType = z.infer<typeof QueueDeploymentMessageSchema>
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
        const { domain, url, envs } = JSON.parse(payload) as MessageType
        let envsString = ``;
        for(let i = 0 ; i<envs.length ; i++){
          const key = envs[i].key;
          const value = envs[i].value;
          envsString.concat(`-e ${key}=${value}`).concat(" ");
        }
        // check if output folder exists
        const exists = fs.existsSync(path.join(__dirname, "outputs"));
        if (!exists) fs.mkdirSync(path.join(__dirname, "outputs"));
        fs.mkdirSync(path.join(__dirname, "outputs", domain));
        try {
          await execPromise(
            `docker run --name=${domain} -e GITHUB_URL=${url} ${envsString} react-builder:latest`
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
        await uploadFolder(path.join(__dirname, "outputs", domain,"dist"), domain);
        const new_url = backendURL.protocol.concat(`//${domain}.`).concat(backendURL.hostname)
        await redis.hSet(`deployments:${domain}`, {url:new_url, status: "deployed"});
        await execPromise(`docker container prune -f && rm -r ${path.join(__dirname,"outputs",domain)}`);
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
