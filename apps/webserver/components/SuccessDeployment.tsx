
import { Check, ExternalLink, Copy } from 'lucide-react'
import Link from 'next/link'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


export default  function SuccessDeployment({ projectId}: { projectId: string}) {
  const backendURL = new URL("http://localhost:4000")
  const deploymentUrl = backendURL.protocol
  .concat(`//${projectId}.`)
  .concat(backendURL.hostname);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Check className="h-6 w-6 text-green-500" />
            <CardTitle className="text-2xl font-bold">Deployment Successful</CardTitle>
          </div>
          <CardDescription>Project ID: {projectId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Your project is now live!</AlertTitle>
            <AlertDescription>
              Your deployment was successful and your project is now accessible at the URL below.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button asChild>
            <Link href={deploymentUrl} target="_blank" rel="noopener noreferrer">
              Visit Site
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}