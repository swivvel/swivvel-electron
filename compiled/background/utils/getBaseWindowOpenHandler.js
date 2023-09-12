"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
exports.default = (targetUrl, siteUrl) => {
    if (targetUrl.startsWith(siteUrl)) {
        electron_log_1.default.info(`User opening internal URL`);
        if (targetUrl.endsWith(`.html`)) {
            electron_log_1.default.info(`Is HTML page, opening in browser`);
            electron_1.shell.openExternal(targetUrl);
            return { action: `deny` };
        }
        electron_log_1.default.info(`Opening internally`);
        return { action: `allow` };
    }
    electron_log_1.default.info(`User opening external URL, opening in browser`);
    electron_1.shell.openExternal(targetUrl);
    return { action: `deny` };
};
