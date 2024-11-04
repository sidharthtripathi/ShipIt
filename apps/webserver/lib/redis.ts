import { createClient } from "redis";
export async function getRedis() {
    const redis = createClient({url : process.env.REDIS_URL})
    if(!redis.isOpen) await redis.connect()
    return redis
}