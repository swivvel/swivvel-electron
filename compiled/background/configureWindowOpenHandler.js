"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
exports.default = (transparentWindow, siteUrl) => {
    transparentWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron_log_1.default.info(`!!!!`);
        electron_log_1.default.info(url);
        electron_log_1.default.info(`!!!!`);
        if (url.startsWith(siteUrl)) {
            if (url.endsWith(`.html`)) {
                electron_1.shell.openExternal(url);
                return { action: `deny` };
            }
            if (url.includes(`/api/auth/login`)) {
                electron_1.shell.openExternal(url);
                return { action: `deny` };
            }
            return { action: `allow` };
        }
        electron_1.shell.openExternal(url);
        return { action: `deny` };
    });
};
