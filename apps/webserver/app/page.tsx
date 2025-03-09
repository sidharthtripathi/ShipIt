import { Form } from "@/components/ui/Form";
import { RocketIcon } from "lucide-react";

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary py-12 px-4 sm:px-6 lg:px-8 animate-gradient-x">
      <div className="max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden md:max-w-2xl bg-card/50 backdrop-blur-sm border border-border/50">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-2">
            <RocketIcon className="w-5 h-5 text-primary animate-pulse" />
            <div className="uppercase tracking-wide text-sm font-semibold text-primary">
              Frontend Deployer
            </div>
          </div>
          <h1 className="block mt-1 text-2xl leading-tight font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Deploy From Your Public GitHub Repository
          </h1>
          <p className="mt-2 text-muted-foreground">
            Enter your repository URL and set up environment variables to deploy your project in seconds.
          </p>
          <Form />
        </div>
      </div>
    </div>
  );
}