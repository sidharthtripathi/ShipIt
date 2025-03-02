import { z } from "zod";

export const formSchema = z.object({
  url: z
    .string()
    .regex(
      /^https:\/\/github\.com\/(?!-)(?!.*--)[A-Za-z0-9-]{1,39}(?<!-)\/[A-Za-z0-9_.-]+$/,
      {
        message:
          "Invalid GitHub URL format. Expected 'https://github.com/user/repo'.",
      }
    ),
  outputDir: z.string().min(1),
  buildCmd: z.string().min(1),
  installCmd: z.string().min(1),

  envs: z.array(
    z.object({
      key: z.string().min(1, "key can not be empty"),
      value: z.string().min(1, "value can not be empty"),
    })
  ),
});

export const QueueDeploymentMessageSchema = formSchema.extend({
  domain: z.string().min(1),
});
