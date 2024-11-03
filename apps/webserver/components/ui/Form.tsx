"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "./input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/app/schema/schema";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
type FormType = z.infer<typeof formSchema>;
export function Form() {
  const [trackingURL, setTrackingURL] = useState<string | undefined>(undefined);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });
  async function onSubmit(payload: FormType) {
    const { data } = await axios.post("/api/deploy", payload);
    reset();
    const { trackingURL } = data;
    setTrackingURL(trackingURL)
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <fieldset disabled={isSubmitting}>
          <div className="mb-4">
            <Label htmlFor="repo-url">GitHub Repository URL</Label>
            <Input
              {...register("url")}
              id="repo-url"
              type="url"
              placeholder="https://github.com/username/repository"
            />
            {errors.url && (
              <p className="text-destructive text-sm mt-2">
                {errors.url.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <Label>Environment Variables</Label>
            <Textarea
              {...register("env")}
              placeholder="paste your env file here"
            />
          </div>
          <Button type="submit" className="w-full">
            Deploy
          </Button>
        </fieldset>
      </form>
      {trackingURL !== undefined && (
        <div className="mt-4">
        <p className="text-bold text-sm">Check Status of deployment <Link className="text-lg underline" href={trackingURL!}>Here</Link></p>
          
        </div>
      )}
    </div>
  );
}
