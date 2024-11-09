import {QueueDeploymentMessageSchema } from "schema";
import amqp from "amqplib";
import { z } from "zod";
type DeployMessageType = z.infer<typeof QueueDeploymentMessageSchema>
export async function sendToQueue(msg: DeployMessageType ) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();
  try {
    await channel.assertQueue("messages", { durable: false });
    await channel.sendToQueue("messages", Buffer.from(JSON.stringify(msg)));
  } catch (error) {
    throw error;
  } finally {
    await channel.close();
    await connection.close();
  }
}
