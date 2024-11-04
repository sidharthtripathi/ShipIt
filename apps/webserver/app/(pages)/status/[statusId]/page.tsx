import { getRedis } from "@/lib/redis"
export default async function StatusPage({params : {statusId}} : {params : {statusId : string}}){
    const redis = await getRedis()
    const status = await redis.hGetAll(`deployments:${statusId}`)
    if(status.status==='pending') return <div>pending</div>
    else if(status.status === 'failed') return <div>failed <div>{status.logs}</div></div>
    else return <div>success</div>
}