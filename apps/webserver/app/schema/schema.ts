import { z } from "zod";

export const formSchema = z.object({
    url : z.string().url(),
    envs : z.array(z.object({key : z.string().min(1,"key can not be empty"), value : z.string().min(1,"value can not be empty")}))
})