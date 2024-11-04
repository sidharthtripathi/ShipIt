import amqp from "amqplib";
export async function sendToQueue(msg: {
  domain: string;
  url: string;
  env: string;
}) {
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
