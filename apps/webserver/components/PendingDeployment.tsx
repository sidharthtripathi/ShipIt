"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AnimatedSpan,
  Terminal,
} from "@/components/magicui/terminal";
import { AlertCircle, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
export default function PendingDeployment({
  projectId,
  setStatus
}: {
  projectId: string;
  setStatus : Dispatch<SetStateAction<string>>
}) {
  const [logs,setLogs] = useState<{log : string,type:string}[]>([])
  useEffect(() => {
    const eventSource = new EventSource(`/api/deploy/${projectId}`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLogs((p)=>([...p,{log : data.log,type : data.type}]))
      if(data.log==="Deployed") setStatus("deployed")
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  },[projectId]);
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">
                Deployment in Progress
              </CardTitle>
              <CardDescription>Project ID: {projectId}</CardDescription>
            </div>
            <Loader2 className="animate-spin" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Deployment Status</AlertTitle>
            <AlertDescription>
              Your project is currently being deployed. This may take a few
              minutes.
            </AlertDescription>
          </Alert>
          <Terminal>
              {
                logs.map((log,idx)=>(
                  <AnimatedSpan key={idx} delay={1000} className={log.type=="log" ? `text-foreground` : `text-destructive`}>
                  <span>{log.log}</span>
                </AnimatedSpan>
                ))
              }
          </Terminal>
        </CardContent>
      </Card>
    </div>
  );
}
