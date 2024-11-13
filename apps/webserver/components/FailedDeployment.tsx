import { AlertTriangle, ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function FailedDeployment({ 
  projectId,
  errorLogs
}: { 
  projectId: string 
  errorLogs: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <CardTitle className="text-2xl font-bold">Deployment Failed</CardTitle>
          </div>
          <CardDescription>Project ID: {projectId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>Deployment Error</AlertTitle>
            <AlertDescription>
              We encountered an error while deploying your project. Please review the error logs below for more information.
            </AlertDescription>
          </Alert>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex justify-between w-full">
                <span>Error Logs</span>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                  {errorLogs}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">
            Contact Support
          </Button>
          <Button>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry Deployment
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}