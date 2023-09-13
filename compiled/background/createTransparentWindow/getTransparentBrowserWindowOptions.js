"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const utils_1 = require("../utils");
exports.default = (preloadPath) => {
    const primaryDisplay = electron_1.screen.getPrimaryDisplay();
    return {
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
    };
};
