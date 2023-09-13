"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
exports.default = (siteUrl, { browserWindowOptions, windowOpenHandler }) => {
    const browserWindow = new electron_1.BrowserWindow(browserWindowOptions);
    browserWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron_log_1.default.info(`Caught URL opened by log in window: ${url}`);
        if (windowOpenHandler) {
            const result = windowOpenHandler(url);
            if (result) {
                return result;
            }
        }
        if (url.startsWith(siteUrl)) {
            electron_log_1.default.info(`User opening internal URL`);
            if (url.endsWith(`.html`)) {
                electron_log_1.default.info(`Is HTML page, opening in browser`);
                electron_1.shell.openExternal(url);
                return { action: `deny` };
            }
            electron_log_1.default.info(`Opening internally`);
            return { action: `allow` };
        }
        electron_log_1.default.info(`User opening external URL, opening in browser`);
        electron_1.shell.openExternal(url);
        return { action: `deny` };
    });
    return browserWindow;
};
