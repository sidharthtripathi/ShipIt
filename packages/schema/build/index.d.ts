import { z } from "zod";
export declare const formSchema: z.ZodObject<{
    url: z.ZodString;
    envs: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        key: string;
    }, {
        value: string;
        key: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    url: string;
    envs: {
        value: string;
        key: string;
    }[];
}, {
    url: string;
    envs: {
        value: string;
        key: string;
    }[];
}>;
export declare const QueueDeploymentMessageSchema: z.ZodObject<z.objectUtil.extendShape<{
    url: z.ZodString;
    envs: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        key: string;
    }, {
        value: string;
        key: string;
    }>, "many">;
}, {
    domain: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    url: string;
    envs: {
        value: string;
        key: string;
    }[];
    domain: string;
}, {
    url: string;
    envs: {
        value: string;
        key: string;
    }[];
    domain: string;
}>;
