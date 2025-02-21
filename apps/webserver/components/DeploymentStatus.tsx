"use client"

import { useState } from "react"
import FailedDeployment from "./FailedDeployment"
import PendingDeployment from "./PendingDeployment"
import SuccessDeployment from "./SuccessDeployment"
import { notFound } from "next/navigation"

export function DeploymentStatus({status,statusId} : {status:string,statusId:string}){
    const [s,setStatus] = useState(status)
    if(s==="pending") return  <PendingDeployment projectId={statusId} setStatus={setStatus} />
    else if(s === 'failed') return <FailedDeployment projectId={statusId} errorLogs="some err" />
    else if(s=== "deployed") return  <SuccessDeployment projectId={statusId} />
    else return notFound()
}