import FailedDeployment from "@/components/FailedDeployment"
import PendingDeployment from "@/components/PendingDeployment"
import SuccessDeployment from "@/components/SuccessDeployment"
import { getRedis } from "@/lib/redis"
export default async function StatusPage({params : {statusId}} : {params : {statusId : string}}){
    const redis = await getRedis()
    const status = await redis.hGetAll(`deployments:${statusId}`)
    if(status.status==='pending') return <PendingDeployment projectId={statusId} />
    else if(status.status === 'failed') return <FailedDeployment projectId={statusId} errorLogs={status.err} />
    else return <SuccessDeployment projectId={statusId} deploymentUrl={status.url} />
}