import PendingDeployment from "@/components/PendingDeployment"
import { getRedis } from "@/lib/redis"
import Link from "next/link"
export default async function StatusPage({params : {statusId}} : {params : {statusId : string}}){
    const redis = await getRedis()
    const status = await redis.hGetAll(`deployments:${statusId}`)
    if(status.status==='pending') return <PendingDeployment projectId={statusId} />
    else if(status.status === 'failed') return <div>failed <div>{status.err}</div></div>
    else return <div>success <Link target="_blank" href={status.url}>click here</Link> </div>
}