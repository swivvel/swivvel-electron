"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const utils_1 = require("../utils");
exports.default = (preloadPath) => {
    electron_log_1.default.info(`  Creating transparent window BrowserWindow...`);
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    const transparentWindow = new electron_1.BrowserWindow({
        alwaysOnTop: true,
        autoHideMenuBar: true,
        closable: false,
        focusable: !(0, utils_1.isLinux)(),
        frame: false,
        hasShadow: false,
        height: primaryDisplay.workAreaSize.height,
        hiddenInMissionControl: true,
        maximizable: false,
        minimizable: false,
        resizable: false,
        roundedCorners: false,
        skipTaskbar: true,
        transparent: true,
        webPreferences: { preload: preloadPath },
        width: primaryDisplay.workAreaSize.width,
        x: 0,
        y: 0,
    });
    return transparentWindow;
};
