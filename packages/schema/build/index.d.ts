import { z } from "zod";
export declare const formSchema: z.ZodObject<{
    url: z.ZodString;
    outputDir: z.ZodString;
    buildCmd: z.ZodString;
    installCmd: z.ZodString;
    envs: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        value: string;
    }, {
        key: string;
        value: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    url: string;
    outputDir: string;
    buildCmd: string;
    installCmd: string;
    envs: {
        key: string;
        value: string;
    }[];
}, {
    url: string;
    outputDir: string;
    buildCmd: string;
    installCmd: string;
    envs: {
        key: string;
        value: string;
    }[];
}>;
export declare const QueueDeploymentMessageSchema: z.ZodObject<z.objectUtil.extendShape<{
    url: z.ZodString;
    outputDir: z.ZodString;
    buildCmd: z.ZodString;
    installCmd: z.ZodString;
    envs: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        value: string;
    }, {
        key: string;
        value: string;
    }>, "many">;
}, {
    domain: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    url: string;
    outputDir: string;
    buildCmd: string;
    installCmd: string;
    envs: {
        key: string;
        value: string;
    }[];
    domain: string;
}, {
    url: string;
    outputDir: string;
    buildCmd: string;
    installCmd: string;
    envs: {
        key: string;
        value: string;
    }[];
    domain: string;
}>;
