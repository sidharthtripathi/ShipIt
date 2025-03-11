"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";
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
} from "@/components/ui/accordion";
import {
  GithubIcon as GitHubLogoIcon,
  PlusIcon,
  RocketIcon,
  TrashIcon,
  Cog,
  KeyRound,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FormType = z.infer<typeof formSchema>;

export function Form() {
  const [trackingURL, setTrackingURL] = useState<string | undefined>(undefined);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormType>({
    defaultValues: {
      url: "https://github.com/sidharthtripathi/react-demo",
      buildCmd: "npm run build",
      installCmd: "npm install",
      outputDir: "dist",
    },
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "envs" });

  async function onSubmit(payload: FormType) {
    const { data } = await axios.post("/api/deploy", payload);
    reset();
    const { trackingURL } = data;
    setTrackingURL(trackingURL);
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <fieldset disabled={isSubmitting} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Label htmlFor="repo-url" className="text-foreground">
              <div className="flex items-center gap-2">
                <GitHubLogoIcon className="w-4 h-4" />
                GitHub Repository URL
              </div>
            </Label>
            <Input
              {...register("url")}
              id="repo-url"
              type="url"
              placeholder="https://github.com/username/repository"
              className="transition-all duration-200 focus:scale-[1.01] bg-background/50 backdrop-blur-sm"
            />
            {errors.url && (
              <p className="text-destructive text-sm mt-2">
                {errors.url.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-1"
                className="border border-border/50 rounded-lg bg-background/50 backdrop-blur-sm"
              >
                <AccordionTrigger className="hover:no-underline px-4 py-2">
                  <span className="flex items-center gap-2">
                    <Cog className="w-4 h-4" />
                    Build Settings
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Install Command</Label>
                    <Input
                      {...register("installCmd")}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Build Command</Label>
                    <Input
                      {...register("buildCmd")}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Output Directory</Label>
                    <Input
                      {...register("outputDir")}
                      className="bg-background/50"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Label className="text-foreground flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Environment Variables
            </Label>
            <div className="space-y-4">
              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <Input
                        placeholder="Key"
                        {...register(`envs.${index}.key`)}
                        className="bg-background/50 backdrop-blur-sm"
                      />
                      {errors.envs?.[index]?.key && (
                        <p className="text-sm text-destructive mt-2">
                          {errors.envs?.[index]?.key?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Value"
                        {...register(`envs.${index}.value`)}
                        className="bg-background/50 backdrop-blur-sm"
                      />
                      {errors.envs?.[index]?.value && (
                        <p className="text-sm text-destructive mt-2">
                          {errors.envs?.[index]?.value?.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-start hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <Button
              type="button"
              onClick={() => append({ key: "", value: "" })}
              variant="outline"
              className="w-full bg-background/50 backdrop-blur-sm"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Environment Variable
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Deploying...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RocketIcon className="w-4 h-4" />
                  Deploy Project
                </div>
              )}
            </Button>
            <Alert className="mt-2">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Demo Repository is provided</AlertTitle>
              <AlertDescription>
                You can use your own Repository as well
              </AlertDescription>
            </Alert>
          </motion.div>
        </fieldset>
      </form>

      <AnimatePresence>
        {trackingURL && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50"
          >
            <p className="text-sm text-foreground">
              Check deployment status{" "}
              <Link
                href={trackingURL}
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
              >
                here
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
