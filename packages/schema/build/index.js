"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueDeploymentMessageSchema = exports.formSchema = void 0;
const zod_1 = require("zod");
exports.formSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    envs: zod_1.z.array(zod_1.z.object({ key: zod_1.z.string().min(1, "key can not be empty"), value: zod_1.z.string().min(1, "value can not be empty") }))
});
exports.QueueDeploymentMessageSchema = exports.formSchema.extend({
    domain: zod_1.z.string().min(1)
});
//# sourceMappingURL=index.js.map