import { DeploymentStatus } from "@/components/DeploymentStatus"
import { getRedis } from "@/lib/redis"
export default async function StatusPage({params : {statusId}} : {params : {statusId : string}}){
    const redis = await getRedis()
    const status = await redis.hGetAll(`deployments:${statusId}`)
    await redis.disconnect()
    
    return <DeploymentStatus status={status.status} statusId={statusId}/>
}