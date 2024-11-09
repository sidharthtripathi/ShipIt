import { formSchema } from "schema";
import { sendToQueue } from "@/lib/amqplib";
import { NextRequest, NextResponse } from "next/server";
import { generateSlug } from "random-word-slugs";
import { getRedis } from "@/lib/redis";
export async function POST(req: NextRequest) {
  try {
    const redis = await getRedis()
    const body = formSchema.parse(await req.json());
    const msgToPush = { ...body, domain: generateSlug(2) };
    await sendToQueue(msgToPush);
    await redis.hSet(`deployments:${msgToPush.domain}`,{status : "pending"})
    return NextResponse.json({ trackingURL: `/status/${msgToPush.domain}` });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Invalid Payload" }, { status: 400 });
  }
}
