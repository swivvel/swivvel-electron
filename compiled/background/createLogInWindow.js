"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("./utils");
exports.default = async (preloadPath) => {
    electron_log_1.default.info(`Creating log in window...`);
    if ((0, utils_1.isLinux)()) {
        await (0, utils_1.sleep)(1000);
    }
    const logInWindow = new electron_1.BrowserWindow({
        height: 650,
        webPreferences: { preload: preloadPath },
        width: 720,
    });
    electron_log_1.default.info(`  Loading Swivvel URL...`);
    await logInWindow.loadURL(`/`);
    if (!(0, utils_1.isProduction)()) {
        logInWindow.webContents.openDevTools();
    }
    electron_log_1.default.info(`Created log in window`);
    return logInWindow;
};
