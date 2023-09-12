"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
exports.default = async (preloadPath, siteUrl) => {
    electron_log_1.default.info(`Creating log in window...`);
    electron_log_1.default.info(preloadPath);
    const logInWindow = new electron_1.BrowserWindow({
        height: 700,
        webPreferences: { preload: preloadPath },
        width: 720,
    });
    const url = `${siteUrl}/`;
    electron_log_1.default.info(`  Loading Swivvel URL: ${url}`);
    await logInWindow.loadURL(url);
    logInWindow.webContents.openDevTools();
    electron_log_1.default.info(`Created log in window`);
    return logInWindow;
};
