import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
export default function PendingDeployment({
  projectId,
}: {
  projectId: string;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader >
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">
                Deployment in Progress
              </CardTitle>
              <CardDescription>Project ID: {projectId}</CardDescription>
            </div>
            <Loader2 className="animate-spin"/>
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
          <Alert className="mt-4">
            <RefreshCw className="h-4 w-4" />
            <AlertTitle>No Live Updates Available</AlertTitle>
            <AlertDescription>
              Live updates are not available during deployment. Please check
              back later for a complete deployment summary.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
