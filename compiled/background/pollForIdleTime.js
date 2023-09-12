"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
exports.default = (transparentWindow) => {
    electron_log_1.default.info(`Configuring idle time polling...`);
    let isIdle = false;
    const interval = setInterval(async () => {
        if (transparentWindow.isDestroyed()) {
            clearInterval(interval);
            return;
        }
        const newIsIdle = electron_1.powerMonitor.getSystemIdleTime() > 30;
        if (newIsIdle !== isIdle) {
            isIdle = newIsIdle;
            transparentWindow.webContents.send(`isIdle`, isIdle);
        }
    }, 1000);
    electron_log_1.default.info(`Configured idle time polling`);
};
