"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "./input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "schema";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
type FormType = z.infer<typeof formSchema>;
export function Form() {
  const [trackingURL, setTrackingURL] = useState<string | undefined>(undefined);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting},
    reset,
  } = useForm<FormType>({
    defaultValues : {
      buildCmd : "npm run build",
      installCmd : "npm install",
      outputDir : "dist"
    },
    resolver: zodResolver(formSchema),
  });
  const { fields, append } = useFieldArray({ control, name: "envs" });
  async function onSubmit(payload: FormType) {
    const { data } = await axios.post("/api/deploy", payload);
    reset();
    const { trackingURL } = data;
    setTrackingURL(trackingURL);
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
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="hover:no-underline">Build Setting</AccordionTrigger>
                <AccordionContent className="px-2 space-y-2">
                  <div>
                    <Label>Installed Command</Label>
                    <Input {...register("installCmd")}/>
                  </div>
                  <div>
                  <Label>Build Command</Label>
                  <Input {...register("buildCmd")}/>
                  </div>
                  <div>
                  <Label>Output Directory</Label>
                  <Input {...register("outputDir")} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="mb-4">
            <Label>Environment Variables</Label>
            <div className="space-y-2 mb-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex justify-around gap-4">
                  <div>
                    <Input
                      placeholder="key"
                      {...register(`envs.${index}.key`)}
                    />
                    {errors.envs?.[index]?.key && (
                      <p className="text-sm text-destructive mt-2">
                        {errors.envs?.[index]?.key.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="value"
                      {...register(`envs.${index}.value`)}
                    />
                    {errors.envs?.[index]?.value && (
                      <p className="text-sm text-destructive mt-2">
                        {errors.envs?.[index]?.value.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              onClick={() => {
                append({ key: "", value: "" });
              }}
            >
              Add More
            </Button>
          </div>
          <Button type="submit" className="w-full">
            Deploy
          </Button>
        </fieldset>
      </form>
      {trackingURL !== undefined && (
        <div className="mt-4">
          <p className="text-bold text-sm">
            Check Status of deployment{" "}
            <Link className="text-lg underline" href={trackingURL!}>
              Here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
