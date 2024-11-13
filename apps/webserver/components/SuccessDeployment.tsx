import { Check, ExternalLink, Copy } from 'lucide-react'
import Link from 'next/link'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessDeployment({ projectId, deploymentUrl}: { projectId: string, deploymentUrl: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(deploymentUrl)
  }

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
          <div className="bg-muted p-4 rounded-md flex items-center justify-between">
            <code className="text-sm font-mono break-all">{deploymentUrl}</code>
            <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy URL">
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy URL</span>
            </Button>
          </div>
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