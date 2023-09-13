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
    const logInWindow = (0, utils_1.makeBrowserWindow)(siteUrl, {
        browserWindowOptions: {
            height: 700,
            webPreferences: { preload: preloadPath },
            width: 720,
        },
    });
    logInWindow.webContents.on(`will-redirect`, (event) => {
        const { url } = event;
        electron_log_1.default.info(`Caught redirect in log in window: ${(0, utils_1.removeQueryParams)(url)}`);
        if (url.includes(`auth0.com/authorize`)) {
            electron_log_1.default.info(`User is logging in, sending to browser for Google SSO`);
            event.preventDefault();
            electron_1.shell.openExternal(url);
            return;
        }
        electron_log_1.default.info(`Proceeding with redirect in log in window`);
    });
    await (0, utils_1.loadInternalUrl)(logInWindow, siteUrl, `/`);
    logInWindow.webContents.openDevTools();
    electron_log_1.default.info(`Created log in window`);
    return logInWindow;
};
