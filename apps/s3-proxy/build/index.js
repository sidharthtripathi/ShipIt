"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const mime_types_1 = __importDefault(require("mime-types"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server = (0, express_1.default)();
const baseurl = process.env.BASE_URL;
server.use((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subDomain = req.hostname.split(".").at(0);
    const path = req.url;
    if (path === "/") {
        const response = yield axios_1.default.get(`${baseurl}/${subDomain}/index.html`, { responseType: "stream" });
        res.setHeader("Content-Type", "text/html");
        response.data.pipe(res);
    }
    else {
        const response = yield axios_1.default.get(`${baseurl}/${subDomain}${path}`, { responseType: "stream" });
        res.setHeader("Content-Type", mime_types_1.default.lookup(path));
        response.data.pipe(res);
    }
}));
const port = process.env.PORT || 4000;
server.listen(port);
