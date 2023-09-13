"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("./utils");
exports.default = async (preloadPath, siteUrl) => {
    electron_log_1.default.info(`Creating log in window...`);
    const logInWindow = new electron_1.BrowserWindow({
        height: 700,
        webPreferences: { preload: preloadPath },
        width: 1400,
    });
    logInWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron_log_1.default.info(`Caught URL opened by log in window: ${url}`);
        if (url === `${siteUrl}/api/auth/login`) {
            electron_log_1.default.info(`User is logging in, sending to browser for Google SSO`);
            electron_1.shell.openExternal(url);
            return { action: `deny` };
        }
        return (0, utils_1.getBaseWindowOpenHandler)(url, siteUrl);
    });
    await (0, utils_1.loadInternalUrl)(logInWindow, siteUrl, `/`);
    logInWindow.webContents.openDevTools();
    electron_log_1.default.info(`Created log in window`);
    return logInWindow;
};
